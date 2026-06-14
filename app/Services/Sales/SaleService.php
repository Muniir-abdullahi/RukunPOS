<?php

namespace App\Services\Sales;

use App\Models\Account;
use App\Models\Customer;
use App\Models\Product;
use App\Models\ProductStock;
use App\Models\Sale;
use App\Models\Warehouse;
use App\Services\Accounting\AccountLedgerService;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\Concerns\NormalizesPagination;
use App\Services\Inventory\StockMovementService;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SaleService
{
    use HandlesServiceExceptions, NormalizesPagination;

    public function __construct(private readonly StockMovementService $stocks, private readonly AccountLedgerService $ledger) {}

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        return $this->tryCatch(fn () => Sale::query()
            ->with(['customer:id,name', 'cashier:id,name'])
            ->withCount('items')
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where('reference', 'like', "%{$search}%")->orWhereHas('customer', fn ($query) => $query->where('name', 'like', "%{$search}%")))
            ->when($filters['customer_id'] ?? null, fn ($query, $id) => $query->where('customer_id', $id))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['payment_status'] ?? null, fn ($query, $status) => $query->where('payment_status', $status))
            ->when($filters['date_from'] ?? null, fn ($query, $date) => $query->whereDate('sale_date', '>=', $date))
            ->when($filters['date_to'] ?? null, fn ($query, $date) => $query->whereDate('sale_date', '<=', $date))
            ->latest()
            ->paginate($this->perPage($filters))
            ->through(fn (Sale $sale) => $this->toRow($sale))
            ->withQueryString());
    }

    public function findForShow(Sale $sale): array
    {
        return $this->tryCatch(fn () => [...$this->toRow($sale->load(['customer', 'cashier', 'items.product', 'payments.account'])), 'items' => $sale->items, 'payments' => $sale->payments]);
    }

    public function formOptions(): array
    {
        return $this->tryCatch(fn () => ['customers' => Customer::query()->active()->orderBy('name')->get(['id', 'name', 'phone']), 'warehouses' => Warehouse::query()->active()->orderBy('name')->get(['id', 'name']), 'accounts' => Account::query()->active()->orderBy('name')->get(['id', 'name', 'type', 'current_balance'])]);
    }

    public function completeSale(array $data): Sale
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($data) {
            $this->validateStock($data['warehouse_id'], $data['cart']);
            $totals = $this->totals($data['cart'], (float) ($data['tax_total'] ?? 0), (float) ($data['discount_total'] ?? 0));
            $paid = collect($data['payments'])->sum(fn ($payment) => (float) $payment['amount']);
            $sale = Sale::create(['reference' => $data['reference'] ?? $this->nextReference(), 'customer_id' => $data['customer_id'] ?? null, 'warehouse_id' => $data['warehouse_id'], 'cashier_id' => auth()->id(), 'sale_date' => now(), 'status' => 'completed', 'payment_status' => $this->paymentStatus($paid, $totals['grand_total']), ...$totals, 'paid_total' => $paid, 'change_total' => max(collect($data['payments'])->sum(fn ($payment) => (float) ($payment['received_amount'] ?? $payment['amount'])) - $totals['grand_total'], 0), 'due_total' => max($totals['grand_total'] - $paid, 0), 'note' => $data['note'] ?? null]);
            foreach ($data['cart'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $line = ((float) $item['quantity'] * (float) $item['unit_price']) + (float) ($item['tax_amount'] ?? 0) - (float) ($item['discount_amount'] ?? 0);
                $sale->items()->create(['product_id' => $product->id, 'product_name_snapshot' => $product->name, 'sku_snapshot' => $product->sku, 'quantity' => $item['quantity'], 'unit_price' => $item['unit_price'], 'unit_cost' => $product->cost_price, 'tax_amount' => $item['tax_amount'] ?? 0, 'discount_amount' => $item['discount_amount'] ?? 0, 'line_total' => $line]);
                $this->stocks->apply($product->id, $data['warehouse_id'], -$item['quantity'], 'sale', $sale, (float) $product->cost_price);
            }
            foreach ($data['payments'] as $payment) {
                $record = $sale->payments()->create(['account_id' => $payment['account_id'] ?? null, 'payment_method' => $payment['method'], 'amount' => $payment['amount'], 'received_amount' => $payment['received_amount'] ?? $payment['amount'], 'change_amount' => max((float) ($payment['received_amount'] ?? $payment['amount']) - (float) $payment['amount'], 0), 'reference' => $payment['reference'] ?? null, 'paid_at' => now()]);
                if (! empty($payment['account_id'])) {
                    $this->ledger->credit(Account::findOrFail($payment['account_id']), (float) $payment['amount'], 'Sale payment', $record);
                }
            }
            AuditLogService::log(auth()->user(), 'Create', 'Sale', $sale, [], $sale->toArray());

            return $sale->load(['items', 'payments', 'customer', 'cashier']);
        }));
    }

    public function delete(Sale $sale): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($sale): void {
            $old = $sale->load('items', 'payments.account')->toArray();
            $this->stocks->reverseFor($sale);
            foreach ($sale->payments as $payment) {
                $this->ledger->reverseFor($payment);
            }
            $sale->delete();
            AuditLogService::log(auth()->user(), 'Delete', 'Sale', null, $old, []);
        }));
    }

    private function validateStock(int $warehouseId, array $cart): void
    {
        foreach ($cart as $item) {
            $quantity = (float) ProductStock::query()->where('warehouse_id', $warehouseId)->where('product_id', $item['product_id'])->value('quantity');
            if ($quantity < (float) $item['quantity']) {
                throw ValidationException::withMessages(['cart' => 'Insufficient stock for one or more products.']);
            }
        }
    }

    private function totals(array $cart, float $tax, float $discount): array
    {
        $subtotal = collect($cart)->sum(fn ($item) => (float) $item['quantity'] * (float) $item['unit_price']);
        $lineTax = collect($cart)->sum(fn ($item) => (float) ($item['tax_amount'] ?? 0));
        $lineDiscount = collect($cart)->sum(fn ($item) => (float) ($item['discount_amount'] ?? 0));
        $taxTotal = $tax + $lineTax;
        $discountTotal = $discount + $lineDiscount;

        return ['subtotal' => $subtotal, 'tax_total' => $taxTotal, 'discount_total' => $discountTotal, 'grand_total' => $subtotal + $taxTotal - $discountTotal];
    }

    private function paymentStatus(float $paid, float $grand): string
    {
        return $paid <= 0 ? 'unpaid' : ($paid >= $grand ? 'paid' : 'partial');
    }

    private function toRow(Sale $sale): array
    {
        return ['id' => $sale->id, 'reference' => $sale->reference, 'customer' => $sale->customer?->name ?? 'Walk-in Customer', 'customer_id' => $sale->customer_id, 'date' => $sale->sale_date?->toDateTimeString(), 'items_count' => $sale->items_count ?? $sale->items->count(), 'grand_total' => (float) $sale->grand_total, 'payment_status' => $sale->payment_status, 'status' => $sale->status, 'cashier' => $sale->cashier?->name];
    }

    private function nextReference(): string
    {
        return 'INV-'.now()->format('Ymd').'-'.str_pad((string) (Sale::withTrashed()->max('id') + 1), 4, '0', STR_PAD_LEFT);
    }
}
