<?php

namespace App\Services\Inventory;

use App\Models\Product;
use App\Models\ProductStock;
use App\Models\StockAdjustment;
use App\Models\StockAdjustmentItem;
use App\Models\StockMovement;
use App\Models\Warehouse;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class StockAdjustmentService
{
    use HandlesServiceExceptions;

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $perPage = min(max((int) ($filters['per_page'] ?? 25), 10), 100);

        return $this->tryCatch(fn () => StockAdjustment::query()
            ->with(['warehouse:id,name', 'items.product:id,name'])
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where(function ($query) use ($search) {
                $query->where('reference', 'like', "%{$search}%")
                    ->orWhereHas('warehouse', fn ($query) => $query->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('items.product', fn ($query) => $query->where('name', 'like', "%{$search}%"));
            }))
            ->latest()
            ->paginate($perPage)
            ->through(fn (StockAdjustment $adjustment) => [
                'id' => $adjustment->id,
                'date' => $adjustment->date?->toDateString(),
                'reference' => $adjustment->reference,
                'warehouse' => $adjustment->warehouse?->name,
                'items_count' => $adjustment->items->count(),
                'products' => $adjustment->items->pluck('product.name')->filter()->join(', '),
                'quantity' => (float) $adjustment->items->sum('quantity'),
                'note' => $adjustment->note,
            ])
            ->withQueryString());
    }

    public function pageData(): array
    {
        return $this->tryCatch(fn () => [
            'products' => Product::query()->orderBy('name')->get(['id', 'name']),
            'warehouses' => Warehouse::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function findForShow(StockAdjustment $stockAdjustment): array
    {
        return $this->tryCatch(function () use ($stockAdjustment) {
            $stockAdjustment->load(['warehouse:id,name', 'items.product:id,name']);

            return [
                'id' => $stockAdjustment->id,
                'reference' => $stockAdjustment->reference,
                'warehouse_id' => $stockAdjustment->warehouse_id,
                'warehouse' => $stockAdjustment->warehouse?->name,
                'date' => $stockAdjustment->date?->toDateString(),
                'note' => $stockAdjustment->note,
                'items' => $stockAdjustment->items->map(fn (StockAdjustmentItem $item) => [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product' => $item->product?->name,
                    'type' => $item->type,
                    'quantity' => (float) $item->quantity,
                    'reason' => $item->reason,
                    'notes' => $item->notes,
                ])->values(),
            ];
        });
    }

    public function process(array $data): StockAdjustment
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($data) {
            $adjustment = StockAdjustment::create([
                'reference' => $data['reference'] ?? 'ADJ-'.now()->format('YmdHis'),
                'warehouse_id' => $data['warehouse_id'],
                'user_id' => auth()->id(),
                'date' => $data['date'] ?? today(),
                'note' => $data['note'] ?? null,
            ]);

            $this->applyItems($adjustment, $data['warehouse_id'], $data['items']);

            AuditLogService::log(auth()->user(), 'Create', 'Stock Adjustment', $adjustment, [], $adjustment->toArray());

            return $adjustment;
        }));
    }

    public function update(StockAdjustment $stockAdjustment, array $data): StockAdjustment
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($stockAdjustment, $data) {
            $stockAdjustment->load('items');
            $oldValues = $stockAdjustment->toArray();
            $this->reverseItems($stockAdjustment);

            $stockAdjustment->update([
                'warehouse_id' => $data['warehouse_id'],
                'date' => $data['date'] ?? $stockAdjustment->date,
                'note' => $data['note'] ?? null,
            ]);
            $this->applyItems($stockAdjustment, $data['warehouse_id'], $data['items']);

            AuditLogService::log(auth()->user(), 'Update', 'Stock Adjustment', $stockAdjustment, $oldValues, $stockAdjustment->fresh('items')->toArray());

            return $stockAdjustment;
        }));
    }

    public function delete(StockAdjustment $stockAdjustment): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($stockAdjustment): void {
            $stockAdjustment->load('items');
            $oldValues = $stockAdjustment->toArray();
            $this->reverseItems($stockAdjustment);
            $stockAdjustment->delete();
            AuditLogService::log(auth()->user(), 'Delete', 'Stock Adjustment', null, $oldValues, []);
        }));
    }

    private function applyItems(StockAdjustment $adjustment, int $warehouseId, array $items): void
    {
        foreach ($items as $item) {
            $adjustmentItem = $adjustment->items()->create($item);
            $quantity = strtolower($item['type']) === 'increase' ? $item['quantity'] : -$item['quantity'];
            ProductStock::query()->firstOrCreate(
                ['product_id' => $item['product_id'], 'warehouse_id' => $warehouseId],
                ['quantity' => 0, 'reserved_quantity' => 0],
            )->increment('quantity', $quantity);
            StockMovement::create([
                'product_id' => $item['product_id'],
                'warehouse_id' => $warehouseId,
                'user_id' => auth()->id(),
                'reference_type' => $adjustmentItem::class,
                'reference_id' => $adjustmentItem->id,
                'movement_type' => 'adjustment',
                'quantity' => $quantity,
                'note' => $item['notes'] ?? $item['reason'] ?? null,
                'occurred_at' => now(),
            ]);
        }
    }

    private function reverseItems(StockAdjustment $adjustment): void
    {
        foreach ($adjustment->items as $item) {
            $quantity = strtolower($item->type) === 'increase' ? -$item->quantity : $item->quantity;
            ProductStock::query()->firstOrCreate(
                ['product_id' => $item->product_id, 'warehouse_id' => $adjustment->warehouse_id],
                ['quantity' => 0, 'reserved_quantity' => 0],
            )->increment('quantity', $quantity);
            StockMovement::query()
                ->where('reference_type', $item::class)
                ->where('reference_id', $item->id)
                ->delete();
            $item->delete();
        }
    }
}
