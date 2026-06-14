<?php

namespace App\Services\Sales;

use App\Models\Customer;
use App\Models\Product;
use App\Models\Quotation;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\Concerns\NormalizesPagination;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class QuotationService
{
    use HandlesServiceExceptions, NormalizesPagination;

    public function __construct(private readonly SaleService $saleService) {}

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        return $this->tryCatch(fn () => Quotation::query()
            ->with('customer:id,name')
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where('reference', 'like', "%{$search}%"))
            ->when($filters['customer_id'] ?? null, fn ($query, $id) => $query->where('customer_id', $id))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate($this->perPage($filters))
            ->through(fn (Quotation $quotation) => ['id' => $quotation->id, 'reference' => $quotation->reference, 'customer' => $quotation->customer?->name, 'customer_id' => $quotation->customer_id, 'date' => $quotation->quotation_date?->toDateString(), 'status' => $quotation->status, 'grand_total' => (float) $quotation->grand_total])
            ->withQueryString());
    }

    public function formOptions(): array
    {
        return $this->tryCatch(fn () => ['customers' => Customer::query()->active()->orderBy('name')->get(['id', 'name']), 'products' => Product::query()->active()->orderBy('name')->get(['id', 'name', 'sku', 'selling_price'])]);
    }

    public function create(array $data): Quotation
    {
        return $this->write(new Quotation, $data, 'Create');
    }

    public function update(Quotation $quotation, array $data): Quotation
    {
        return $this->write($quotation, $data, 'Update');
    }

    public function delete(Quotation $quotation): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($quotation): void {
            $old = $quotation->load('items')->toArray();
            $quotation->delete();
            AuditLogService::log(auth()->user(), 'Delete', 'Quotation', null, $old, []);
        }));
    }

    public function convertToSale(Quotation $quotation, array $saleData): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($quotation, $saleData): void {
            $sale = $this->saleService->completeSale($saleData);
            $quotation->update(['converted_sale_id' => $sale->id, 'status' => 'converted']);
            AuditLogService::log(auth()->user(), 'Convert', 'Quotation', $quotation, [], ['sale_id' => $sale->id]);
        }));
    }

    private function write(Quotation $quotation, array $data, string $action): Quotation
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($quotation, $data, $action) {
            $old = $quotation->exists ? $quotation->load('items')->toArray() : [];
            $totals = $this->totals($data['items'], (float) ($data['tax_total'] ?? 0), (float) ($data['discount_total'] ?? 0));
            $quotation->fill(['reference' => $quotation->reference ?? $data['reference'] ?? $this->nextReference(), 'customer_id' => $data['customer_id'] ?? null, 'user_id' => auth()->id(), 'quotation_date' => $data['quotation_date'] ?? today(), 'status' => $data['status'] ?? 'pending', ...$totals, 'note' => $data['note'] ?? null])->save();
            $quotation->items()->delete();
            foreach ($data['items'] as $item) {
                $line = ((float) $item['quantity'] * (float) $item['unit_price']) + (float) ($item['tax_amount'] ?? 0) - (float) ($item['discount_amount'] ?? 0);
                $quotation->items()->create([...$item, 'tax_amount' => $item['tax_amount'] ?? 0, 'discount_amount' => $item['discount_amount'] ?? 0, 'line_total' => $line]);
            }
            AuditLogService::log(auth()->user(), $action, 'Quotation', $quotation, $old, $quotation->fresh('items')->toArray());

            return $quotation;
        }));
    }

    private function totals(array $items, float $tax, float $discount): array
    {
        $subtotal = collect($items)->sum(fn ($item) => (float) $item['quantity'] * (float) $item['unit_price']);

        return ['subtotal' => $subtotal, 'tax_total' => $tax, 'discount_total' => $discount, 'grand_total' => $subtotal + $tax - $discount];
    }

    private function nextReference(): string
    {
        return 'QT-'.now()->format('Ymd').'-'.str_pad((string) (Quotation::withTrashed()->max('id') + 1), 4, '0', STR_PAD_LEFT);
    }
}
