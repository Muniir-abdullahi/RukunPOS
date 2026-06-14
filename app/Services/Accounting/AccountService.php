<?php

namespace App\Services\Accounting;

use App\Models\Account;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\Concerns\NormalizesPagination;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class AccountService
{
    use HandlesServiceExceptions, NormalizesPagination;

    public function __construct(private readonly AccountLedgerService $ledger) {}

    public function getAll(array $filters = [])
    {
        return $this->tryCatch(fn () => Account::query()
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where('name', 'like', "%{$search}%")->orWhere('account_no', 'like', "%{$search}%"))
            ->orderBy('name')
            ->get());
    }

    public function transactions(Account $account, array $filters = []): LengthAwarePaginator
    {
        return $this->tryCatch(fn () => $account->transactions()
            ->when($filters['date_from'] ?? null, fn ($query, $date) => $query->whereDate('transaction_date', '>=', $date))
            ->when($filters['date_to'] ?? null, fn ($query, $date) => $query->whereDate('transaction_date', '<=', $date))
            ->when(($filters['type'] ?? null) === 'debit', fn ($query) => $query->where('debit', '>', 0))
            ->when(($filters['type'] ?? null) === 'credit', fn ($query) => $query->where('credit', '>', 0))
            ->latest('transaction_date')
            ->paginate($this->perPage($filters))
            ->withQueryString());
    }

    public function create(array $data): Account
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($data) {
            $account = Account::create([
                'account_no' => $data['account_no'] ?? $this->nextAccountNo(),
                'name' => $data['name'],
                'type' => $data['type'] ?? null,
                'opening_balance' => $data['opening_balance'] ?? 0,
                'current_balance' => 0,
                'status' => strtolower($data['status'] ?? 'active'),
            ]);
            if ((float) $account->opening_balance > 0) {
                $this->ledger->credit($account, (float) $account->opening_balance, 'Opening balance', $account);
            }
            AuditLogService::log(auth()->user(), 'Create', 'Account', $account, [], $account->toArray());

            return $account->refresh();
        }));
    }

    public function update(Account $account, array $data): Account
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($account, $data) {
            $old = $account->toArray();
            $account->update([
                'account_no' => $data['account_no'] ?? $account->account_no,
                'name' => $data['name'],
                'type' => $data['type'] ?? null,
                'status' => strtolower($data['status'] ?? 'active'),
            ]);
            AuditLogService::log(auth()->user(), 'Update', 'Account', $account, $old, $account->toArray());

            return $account;
        }));
    }

    public function delete(Account $account): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($account): void {
            $old = $account->toArray();
            $account->delete();
            AuditLogService::log(auth()->user(), 'Delete', 'Account', null, $old, []);
        }));
    }

    private function nextAccountNo(): string
    {
        return 'ACC-'.str_pad((string) (Account::withTrashed()->max('id') + 1), 4, '0', STR_PAD_LEFT);
    }
}
