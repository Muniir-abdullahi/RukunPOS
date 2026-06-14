<?php

namespace App\Services\Purchases;

use App\Models\Purchase;
use App\Models\PurchaseReturn;
use App\Models\Supplier;
use App\Models\Warehouse;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\Concerns\NormalizesPagination;
use App\Services\Inventory\StockMovementService;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PurchaseReturnService
{
    use HandlesServiceExceptions, NormalizesPagination;

    public function __construct(private readonly StockMovementService $stocks) {}

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        return $this->tryCatch(fn () => PurchaseReturn::query()
            ->with(['supplier:id,name', 'warehouse:id,name'])
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where('reference', 'like', "%{$search}%"))
            ->latest()
            ->paginate($this->perPage($filters))
            ->through(fn (PurchaseReturn $return) => ['id' => $return->id, 'reference' => $return->reference, 'supplier' => $return->supplier?->name, 'date' => $return->return_date?->toDateString(), 'grand_total' => (float) $return->grand_total])
            ->withQueryString());
    }

    public function formOptions(): array
    {
        return $this->tryCatch(fn () => ['purchases' => Purchase::query()->where('status', 'received')->latest()->get(['id', 'reference']), 'suppliers' => Supplier::query()->active()->orderBy('name')->get(['id', 'name']), 'warehouses' => Warehouse::query()->active()->orderBy('name')->get(['id', 'name'])]);
    }

    public function create(array $data): PurchaseReturn
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($data) {
            $grand = collect($data['items'])->sum(fn ($item) => (float) $item['quantity'] * (float) $item['unit_cost']);
            $return = PurchaseReturn::create(['reference' => $data['reference'] ?? $this->nextReference(), 'purchase_id' => $data['purchase_id'] ?? null, 'supplier_id' => $data['supplier_id'] ?? null, 'warehouse_id' => $data['warehouse_id'], 'user_id' => auth()->id(), 'return_date' => $data['return_date'] ?? today(), 'grand_total' => $grand, 'note' => $data['note'] ?? null]);
            foreach ($data['items'] as $item) {
                $line = (float) $item['quantity'] * (float) $item['unit_cost'];
                $return->items()->create([...$item, 'line_total' => $line]);
                $this->stocks->apply($item['product_id'], $data['warehouse_id'], -$item['quantity'], 'purchase_return', $return, $item['unit_cost']);
            }
            AuditLogService::log(auth()->user(), 'Create', 'Purchase Return', $return, [], $return->toArray());

            return $return;
        }));
    }

    public function delete(PurchaseReturn $purchaseReturn): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($purchaseReturn): void {
            $old = $purchaseReturn->load('items')->toArray();
            $this->stocks->reverseFor($purchaseReturn);
            $purchaseReturn->delete();
            AuditLogService::log(auth()->user(), 'Delete', 'Purchase Return', null, $old, []);
        }));
    }

    private function nextReference(): string
    {
        return 'PR-'.now()->format('Ymd').'-'.str_pad((string) (PurchaseReturn::query()->max('id') + 1), 4, '0', STR_PAD_LEFT);
    }
}
