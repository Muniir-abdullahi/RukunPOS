<?php

namespace App\Services\Sales;

use App\Models\Account;
use App\Models\SaleReturn;
use App\Services\Accounting\AccountLedgerService;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\Concerns\NormalizesPagination;
use App\Services\Inventory\StockMovementService;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class SaleReturnService
{
    use HandlesServiceExceptions, NormalizesPagination;

    public function __construct(private readonly StockMovementService $stocks, private readonly AccountLedgerService $ledger) {}

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        return $this->tryCatch(fn () => SaleReturn::query()
            ->with('customer:id,name')
            ->latest()
            ->paginate($this->perPage($filters))
            ->through(fn (SaleReturn $return) => ['id' => $return->id, 'reference' => $return->reference, 'customer' => $return->customer?->name, 'date' => $return->return_date?->toDateString(), 'grand_total' => (float) $return->grand_total, 'refund_method' => $return->refund_method])
            ->withQueryString());
    }

    public function create(array $data): SaleReturn
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($data) {
            $grand = collect($data['items'])->sum(fn ($item) => (float) $item['quantity'] * (float) $item['unit_price']);
            $return = SaleReturn::create(['reference' => $data['reference'] ?? $this->nextReference(), 'sale_id' => $data['sale_id'] ?? null, 'customer_id' => $data['customer_id'] ?? null, 'warehouse_id' => $data['warehouse_id'], 'user_id' => auth()->id(), 'return_date' => $data['return_date'] ?? today(), 'grand_total' => $grand, 'refund_method' => $data['refund_method'] ?? null, 'note' => $data['note'] ?? null]);
            foreach ($data['items'] as $item) {
                $line = (float) $item['quantity'] * (float) $item['unit_price'];
                $return->items()->create([...$item, 'line_total' => $line]);
                $this->stocks->apply($item['product_id'], $data['warehouse_id'], $item['quantity'], 'sale_return', $return);
            }
            if (! empty($data['account_id'])) {
                $this->ledger->debit(Account::findOrFail($data['account_id']), $grand, 'Sale return refund', $return);
            }
            AuditLogService::log(auth()->user(), 'Create', 'Sale Return', $return, [], $return->toArray());

            return $return;
        }));
    }

    public function delete(SaleReturn $saleReturn): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($saleReturn): void {
            $old = $saleReturn->load('items')->toArray();
            $this->stocks->reverseFor($saleReturn);
            $this->ledger->reverseFor($saleReturn);
            $saleReturn->delete();
            AuditLogService::log(auth()->user(), 'Delete', 'Sale Return', null, $old, []);
        }));
    }

    private function nextReference(): string
    {
        return 'SR-'.now()->format('Ymd').'-'.str_pad((string) (SaleReturn::query()->max('id') + 1), 4, '0', STR_PAD_LEFT);
    }
}
