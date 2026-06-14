<?php

namespace App\Services\Inventory;

use App\Models\ProductStock;
use App\Models\StockMovement;
use App\Models\StockTransfer;
use App\Models\StockTransferItem;
use App\Models\Warehouse;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class StockTransferService
{
    use HandlesServiceExceptions;

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $perPage = min(max((int) ($filters['per_page'] ?? 25), 10), 100);

        return $this->tryCatch(fn () => StockTransfer::query()
            ->with(['fromWarehouse:id,name', 'toWarehouse:id,name'])
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where(function ($query) use ($search) {
                $query->where('reference', 'like', "%{$search}%")
                    ->orWhereHas('fromWarehouse', fn ($query) => $query->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('toWarehouse', fn ($query) => $query->where('name', 'like', "%{$search}%"));
            }))
            ->latest()
            ->paginate($perPage)
            ->through(fn (StockTransfer $transfer) => [
                'id' => $transfer->id,
                'date' => $transfer->date?->toDateString(),
                'reference' => $transfer->reference,
                'from' => $transfer->fromWarehouse?->name,
                'to' => $transfer->toWarehouse?->name,
                'status' => $transfer->status,
            ])
            ->withQueryString());
    }

    public function pageData(): array
    {
        return $this->tryCatch(fn () => [
            'module' => 'stockTransfers',
            'warehouses' => Warehouse::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function findForShow(StockTransfer $stockTransfer): array
    {
        return $this->tryCatch(function () use ($stockTransfer) {
            $stockTransfer->load(['fromWarehouse:id,name', 'toWarehouse:id,name', 'items.product:id,name']);

            return [
                'id' => $stockTransfer->id,
                'reference' => $stockTransfer->reference,
                'from_warehouse_id' => $stockTransfer->from_warehouse_id,
                'to_warehouse_id' => $stockTransfer->to_warehouse_id,
                'from' => $stockTransfer->fromWarehouse?->name,
                'to' => $stockTransfer->toWarehouse?->name,
                'date' => $stockTransfer->date?->toDateString(),
                'status' => $stockTransfer->status,
                'note' => $stockTransfer->note,
                'items' => $stockTransfer->items->map(fn (StockTransferItem $item) => [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product' => $item->product?->name,
                    'quantity' => (float) $item->quantity,
                ])->values(),
            ];
        });
    }

    public function process(array $data): StockTransfer
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($data) {
            $transfer = StockTransfer::create([
                'reference' => $data['reference'] ?? 'TRN-'.now()->format('YmdHis'),
                'from_warehouse_id' => $data['from_warehouse_id'],
                'to_warehouse_id' => $data['to_warehouse_id'],
                'user_id' => auth()->id(),
                'date' => $data['date'] ?? today(),
                'status' => $data['status'] ?? 'completed',
                'note' => $data['note'] ?? null,
            ]);

            $this->applyItems($transfer, $data['from_warehouse_id'], $data['to_warehouse_id'], $data['items']);

            AuditLogService::log(auth()->user(), 'Create', 'Stock Transfer', $transfer, [], $transfer->toArray());

            return $transfer;
        }));
    }

    public function update(StockTransfer $stockTransfer, array $data): StockTransfer
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($stockTransfer, $data) {
            $stockTransfer->load('items');
            $oldValues = $stockTransfer->toArray();
            $this->reverseItems($stockTransfer);

            $stockTransfer->update([
                'from_warehouse_id' => $data['from_warehouse_id'],
                'to_warehouse_id' => $data['to_warehouse_id'],
                'date' => $data['date'] ?? $stockTransfer->date,
                'status' => $data['status'] ?? $stockTransfer->status,
                'note' => $data['note'] ?? null,
            ]);
            $this->applyItems($stockTransfer, $data['from_warehouse_id'], $data['to_warehouse_id'], $data['items']);

            AuditLogService::log(auth()->user(), 'Update', 'Stock Transfer', $stockTransfer, $oldValues, $stockTransfer->fresh('items')->toArray());

            return $stockTransfer;
        }));
    }

    public function delete(StockTransfer $stockTransfer): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($stockTransfer): void {
            $stockTransfer->load('items');
            $oldValues = $stockTransfer->toArray();
            $this->reverseItems($stockTransfer);
            $stockTransfer->delete();
            AuditLogService::log(auth()->user(), 'Delete', 'Stock Transfer', null, $oldValues, []);
        }));
    }

    private function applyItems(StockTransfer $transfer, int $fromWarehouseId, int $toWarehouseId, array $items): void
    {
        foreach ($items as $item) {
            $transferItem = $transfer->items()->create($item);
            ProductStock::query()->firstOrCreate(['product_id' => $item['product_id'], 'warehouse_id' => $fromWarehouseId], ['quantity' => 0, 'reserved_quantity' => 0])->decrement('quantity', $item['quantity']);
            ProductStock::query()->firstOrCreate(['product_id' => $item['product_id'], 'warehouse_id' => $toWarehouseId], ['quantity' => 0, 'reserved_quantity' => 0])->increment('quantity', $item['quantity']);

            foreach ([['warehouse_id' => $fromWarehouseId, 'type' => 'transfer_out', 'quantity' => -$item['quantity']], ['warehouse_id' => $toWarehouseId, 'type' => 'transfer_in', 'quantity' => $item['quantity']]] as $movement) {
                StockMovement::create(['product_id' => $item['product_id'], 'warehouse_id' => $movement['warehouse_id'], 'user_id' => auth()->id(), 'reference_type' => $transferItem::class, 'reference_id' => $transferItem->id, 'movement_type' => $movement['type'], 'quantity' => $movement['quantity'], 'occurred_at' => now()]);
            }
        }
    }

    private function reverseItems(StockTransfer $transfer): void
    {
        foreach ($transfer->items as $item) {
            ProductStock::query()->firstOrCreate(['product_id' => $item->product_id, 'warehouse_id' => $transfer->from_warehouse_id], ['quantity' => 0, 'reserved_quantity' => 0])->increment('quantity', $item->quantity);
            ProductStock::query()->firstOrCreate(['product_id' => $item->product_id, 'warehouse_id' => $transfer->to_warehouse_id], ['quantity' => 0, 'reserved_quantity' => 0])->decrement('quantity', $item->quantity);
            StockMovement::query()
                ->where('reference_type', $item::class)
                ->where('reference_id', $item->id)
                ->delete();
            $item->delete();
        }
    }
}
