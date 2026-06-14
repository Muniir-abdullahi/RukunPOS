<?php

namespace App\Services\Expenses;

use App\Models\Account;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Services\Accounting\AccountLedgerService;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\Concerns\NormalizesPagination;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ExpenseService
{
    use HandlesServiceExceptions, NormalizesPagination;

    public function __construct(private readonly AccountLedgerService $ledger) {}

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        return $this->tryCatch(fn () => Expense::query()
            ->with(['category:id,name', 'account:id,name'])
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where('reference', 'like', "%{$search}%")->orWhere('note', 'like', "%{$search}%"))
            ->when($filters['expense_category_id'] ?? null, fn ($query, $id) => $query->where('expense_category_id', $id))
            ->when($filters['account_id'] ?? null, fn ($query, $id) => $query->where('account_id', $id))
            ->when($filters['date_from'] ?? null, fn ($query, $date) => $query->whereDate('expense_date', '>=', $date))
            ->when($filters['date_to'] ?? null, fn ($query, $date) => $query->whereDate('expense_date', '<=', $date))
            ->latest()
            ->paginate($this->perPage($filters))
            ->through(fn (Expense $expense) => ['id' => $expense->id, 'reference' => $expense->reference, 'category' => $expense->category?->name, 'account' => $expense->account?->name, 'expense_date' => $expense->expense_date?->toDateString(), 'amount' => (float) $expense->amount, 'note' => $expense->note])
            ->withQueryString());
    }

    public function formOptions(): array
    {
        return $this->tryCatch(fn () => ['expenseCategories' => ExpenseCategory::query()->active()->orderBy('name')->get(['id', 'name']), 'accounts' => Account::query()->active()->orderBy('name')->get(['id', 'name', 'current_balance'])]);
    }

    public function create(array $data): Expense
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($data) {
            $expense = Expense::create([...$data, 'reference' => $data['reference'] ?? $this->nextReference(), 'user_id' => auth()->id(), 'expense_date' => $data['expense_date'] ?? today()]);
            $this->ledger->debit(Account::findOrFail($data['account_id']), (float) $expense->amount, $expense->category?->name ?? 'Expense', $expense);
            AuditLogService::log(auth()->user(), 'Create', 'Expense', $expense, [], $expense->toArray());

            return $expense;
        }));
    }

    public function update(Expense $expense, array $data): Expense
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($expense, $data) {
            $old = $expense->toArray();
            $this->reverse($expense);
            $expense->update([...$data, 'expense_date' => $data['expense_date'] ?? $expense->expense_date]);
            $this->ledger->debit(Account::findOrFail($data['account_id']), (float) $expense->amount, $expense->category?->name ?? 'Expense', $expense);
            AuditLogService::log(auth()->user(), 'Update', 'Expense', $expense, $old, $expense->toArray());

            return $expense;
        }));
    }

    public function delete(Expense $expense): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($expense): void {
            $old = $expense->toArray();
            $this->reverse($expense);
            $expense->delete();
            AuditLogService::log(auth()->user(), 'Delete', 'Expense', null, $old, []);
        }));
    }

    private function reverse(Expense $expense): void
    {
        if ($expense->account_id) {
            $this->ledger->reverseFor($expense);
        }
    }

    private function nextReference(): string
    {
        return 'EXP-'.now()->format('Ymd').'-'.str_pad((string) (Expense::withTrashed()->max('id') + 1), 4, '0', STR_PAD_LEFT);
    }
}
