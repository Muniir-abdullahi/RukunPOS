<?php

namespace App\Services\Accounting;

use App\Models\Account;
use App\Models\MoneyTransfer;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\Concerns\NormalizesPagination;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MoneyTransferService
{
    use HandlesServiceExceptions, NormalizesPagination;

    public function __construct(private readonly AccountLedgerService $ledger) {}

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        return $this->tryCatch(fn () => MoneyTransfer::query()
            ->with(['fromAccount:id,name', 'toAccount:id,name'])
            ->when($filters['from_account_id'] ?? null, fn ($query, $id) => $query->where('from_account_id', $id))
            ->when($filters['date_from'] ?? null, fn ($query, $date) => $query->whereDate('transfer_date', '>=', $date))
            ->when($filters['date_to'] ?? null, fn ($query, $date) => $query->whereDate('transfer_date', '<=', $date))
            ->latest()
            ->paginate($this->perPage($filters))
            ->through(fn (MoneyTransfer $transfer) => [
                'id' => $transfer->id,
                'reference' => $transfer->reference,
                'from_account' => $transfer->fromAccount?->name,
                'to_account' => $transfer->toAccount?->name,
                'transfer_date' => $transfer->transfer_date?->toDateString(),
                'amount' => (float) $transfer->amount,
                'note' => $transfer->note,
            ])
            ->withQueryString());
    }

    public function transfer(array $data): MoneyTransfer
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($data) {
            $from = Account::lockForUpdate()->findOrFail($data['from_account_id']);
            $to = Account::lockForUpdate()->findOrFail($data['to_account_id']);
            if ((float) $from->current_balance < (float) $data['amount']) {
                throw ValidationException::withMessages(['amount' => 'Insufficient source account balance.']);
            }
            $transfer = MoneyTransfer::create([
                'reference' => 'TRF-'.now()->format('Ymd').'-'.uniqid(),
                'from_account_id' => $from->id,
                'to_account_id' => $to->id,
                'user_id' => auth()->id(),
                'transfer_date' => $data['transfer_date'] ?? today(),
                'amount' => $data['amount'],
                'note' => $data['note'] ?? null,
            ]);
            $this->ledger->debit($from, (float) $data['amount'], 'Money transfer out', $transfer);
            $this->ledger->credit($to, (float) $data['amount'], 'Money transfer in', $transfer);
            AuditLogService::log(auth()->user(), 'Create', 'Money Transfer', $transfer, [], $transfer->toArray());

            return $transfer;
        }));
    }

    public function delete(MoneyTransfer $moneyTransfer): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($moneyTransfer): void {
            $old = $moneyTransfer->toArray();
            $this->ledger->reverseFor($moneyTransfer);
            $moneyTransfer->delete();
            AuditLogService::log(auth()->user(), 'Delete', 'Money Transfer', null, $old, []);
        }));
    }
}
