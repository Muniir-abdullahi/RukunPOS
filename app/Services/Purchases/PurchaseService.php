<?php

namespace App\Services\Purchases;

use App\Models\Account;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Supplier;
use App\Models\Warehouse;
use App\Services\Accounting\AccountLedgerService;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\Concerns\NormalizesPagination;
use App\Services\Inventory\StockMovementService;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PurchaseService
{
    use HandlesServiceExceptions, NormalizesPagination;

    public function __construct(private readonly StockMovementService $stocks, private readonly AccountLedgerService $ledger) {}

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        return $this->tryCatch(fn () => Purchase::query()
            ->with(['supplier:id,name', 'warehouse:id,name'])
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where('reference', 'like', "%{$search}%")->orWhereHas('supplier', fn ($query) => $query->where('name', 'like', "%{$search}%")))
            ->when($filters['supplier_id'] ?? null, fn ($query, $id) => $query->where('supplier_id', $id))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['payment_status'] ?? null, fn ($query, $status) => $query->where('payment_status', $status))
            ->when($filters['date_from'] ?? null, fn ($query, $date) => $query->whereDate('purchase_date', '>=', $date))
            ->when($filters['date_to'] ?? null, fn ($query, $date) => $query->whereDate('purchase_date', '<=', $date))
            ->latest()
            ->paginate($this->perPage($filters))
            ->through(fn (Purchase $purchase) => $this->toRow($purchase))
            ->withQueryString());
    }

    public function findForShow(Purchase $purchase): array
    {
        return $this->tryCatch(fn () => [...$this->toRow($purchase->load(['supplier', 'warehouse', 'items.product', 'payments.account'])), 'items' => $purchase->items, 'payments' => $purchase->payments]);
    }

    public function formOptions(): array
    {
        return $this->tryCatch(fn () => [
            'suppliers' => Supplier::query()->active()->orderBy('name')->get(['id', 'name']),
            'warehouses' => Warehouse::query()->active()->orderBy('name')->get(['id', 'name']),
            'products' => Product::query()->active()->orderBy('name')->get(['id', 'name', 'sku', 'cost_price']),
            'accounts' => Account::query()->active()->orderBy('name')->get(['id', 'name', 'type', 'current_balance']),
        ]);
    }

    public function create(array $data): Purchase
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($data) {
            $purchase = Purchase::create($this->payload($data));
            $this->syncItems($purchase, $data['items']);
            $this->applyPayment($purchase, $data['payment'] ?? null);
            $purchase->load('items');
            $this->applyStockIfReceived($purchase);
            AuditLogService::log(auth()->user(), 'Create', 'Purchase', $purchase, [], $purchase->toArray());

            return $purchase;
        }));
    }

    public function update(Purchase $purchase, array $data): Purchase
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($purchase, $data) {
            $old = $purchase->load('items')->toArray();
            $this->reverseStock($purchase);
            $purchase->update($this->payload($data, $purchase));
            $purchase->items()->delete();
            $this->syncItems($purchase, $data['items']);
            $purchase->load('items');
            $this->applyStockIfReceived($purchase);
            AuditLogService::log(auth()->user(), 'Update', 'Purchase', $purchase, $old, $purchase->fresh('items')->toArray());

            return $purchase;
        }));
    }

    public function addPayment(Purchase $purchase, array $data): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($purchase, $data): void {
            $this->applyPayment($purchase, $data);
            AuditLogService::log(auth()->user(), 'Create', 'Purchase Payment', $purchase, [], $data);
        }));
    }

    public function delete(Purchase $purchase): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($purchase): void {
            $old = $purchase->load('items')->toArray();
            $this->reverseStock($purchase);
            $purchase->delete();
            AuditLogService::log(auth()->user(), 'Delete', 'Purchase', null, $old, []);
        }));
    }

    private function payload(array $data, ?Purchase $purchase = null): array
    {
        $totals = $this->totals($data['items'], (float) ($data['shipping_total'] ?? 0));
        $paid = $purchase ? (float) $purchase->paid_total : (float) ($data['payment']['amount'] ?? 0);

        return [
            'reference' => $purchase?->reference ?? $data['reference'] ?? $this->nextReference(),
            'supplier_id' => $data['supplier_id'] ?? null,
            'warehouse_id' => $data['warehouse_id'],
            'user_id' => auth()->id(),
            'purchase_date' => $data['purchase_date'] ?? today(),
            'status' => $data['status'] ?? 'pending',
            'payment_status' => $this->paymentStatus($paid, $totals['grand_total']),
            ...$totals,
            'paid_total' => $paid,
            'due_total' => max($totals['grand_total'] - $paid, 0),
            'note' => $data['note'] ?? null,
        ];
    }

    private function syncItems(Purchase $purchase, array $items): void
    {
        foreach ($items as $item) {
            $line = ((float) $item['quantity'] * (float) $item['unit_cost']) + (float) ($item['tax_amount'] ?? 0) - (float) ($item['discount_amount'] ?? 0);
            $purchase->items()->create([...$item, 'tax_amount' => $item['tax_amount'] ?? 0, 'discount_amount' => $item['discount_amount'] ?? 0, 'line_total' => $line]);
        }
    }

    private function applyPayment(Purchase $purchase, ?array $payment): void
    {
        if (! $payment || empty($payment['amount'])) {
            return;
        }
        $record = $purchase->payments()->create(['account_id' => $payment['account_id'] ?? null, 'amount' => $payment['amount'], 'payment_method' => $payment['payment_method'] ?? 'cash', 'reference' => $payment['reference'] ?? null, 'paid_at' => now(), 'note' => $payment['note'] ?? null]);
        $purchase->increment('paid_total', (float) $payment['amount']);
        $purchase->update(['payment_status' => $this->paymentStatus((float) $purchase->paid_total, (float) $purchase->grand_total), 'due_total' => max((float) $purchase->grand_total - (float) $purchase->paid_total, 0)]);
        if (! empty($payment['account_id'])) {
            $this->ledger->debit(Account::findOrFail($payment['account_id']), (float) $payment['amount'], 'Purchase payment', $record);
        }
    }

    private function applyStockIfReceived(Purchase $purchase): void
    {
        if ($purchase->status !== 'received' || ! $purchase->warehouse_id) {
            return;
        }
        foreach ($purchase->items as $item) {
            $this->stocks->apply($item->product_id, $purchase->warehouse_id, (float) $item->quantity, 'purchase', $purchase, (float) $item->unit_cost);
        }
    }

    private function reverseStock(Purchase $purchase): void
    {
        $this->stocks->reverseFor($purchase);
    }

    private function totals(array $items, float $shipping): array
    {
        $subtotal = collect($items)->sum(fn ($item) => (float) $item['quantity'] * (float) $item['unit_cost']);
        $tax = collect($items)->sum(fn ($item) => (float) ($item['tax_amount'] ?? 0));
        $discount = collect($items)->sum(fn ($item) => (float) ($item['discount_amount'] ?? 0));
        $grand = $subtotal + $tax + $shipping - $discount;

        return ['subtotal' => $subtotal, 'tax_total' => $tax, 'discount_total' => $discount, 'shipping_total' => $shipping, 'grand_total' => $grand];
    }

    private function paymentStatus(float $paid, float $grand): string
    {
        return $paid <= 0 ? 'unpaid' : ($paid >= $grand ? 'paid' : 'partial');
    }

    private function toRow(Purchase $purchase): array
    {
        return ['id' => $purchase->id, 'reference' => $purchase->reference, 'supplier' => $purchase->supplier?->name, 'supplier_id' => $purchase->supplier_id, 'date' => $purchase->purchase_date?->toDateString(), 'status' => $purchase->status, 'payment_status' => $purchase->payment_status, 'grand_total' => (float) $purchase->grand_total, 'paid_total' => (float) $purchase->paid_total, 'due_total' => (float) $purchase->due_total];
    }

    private function nextReference(): string
    {
        return 'PO-'.now()->format('Ymd').'-'.str_pad((string) (Purchase::withTrashed()->max('id') + 1), 4, '0', STR_PAD_LEFT);
    }
}
