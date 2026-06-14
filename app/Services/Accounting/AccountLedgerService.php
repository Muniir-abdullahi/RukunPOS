<?php

namespace App\Services\Accounting;

use App\Models\Account;
use App\Models\AccountTransaction;
use Illuminate\Database\Eloquent\Model;

class AccountLedgerService
{
    public function debit(Account $account, float $amount, string $description, ?Model $reference = null): AccountTransaction
    {
        $account->decrement('current_balance', $amount);
        $account->refresh();

        return $this->record($account, $description, $amount, 0, $reference);
    }

    public function credit(Account $account, float $amount, string $description, ?Model $reference = null): AccountTransaction
    {
        $account->increment('current_balance', $amount);
        $account->refresh();

        return $this->record($account, $description, 0, $amount, $reference);
    }

    public function deleteFor(Model $reference): void
    {
        AccountTransaction::query()
            ->where('reference_type', $reference::class)
            ->where('reference_id', $reference->getKey())
            ->delete();
    }

    public function reverseFor(Model $reference): void
    {
        $transactions = AccountTransaction::query()
            ->with('account')
            ->where('reference_type', $reference::class)
            ->where('reference_id', $reference->getKey())
            ->get();

        foreach ($transactions as $transaction) {
            if ((float) $transaction->debit > 0) {
                $transaction->account->increment('current_balance', (float) $transaction->debit);
            }

            if ((float) $transaction->credit > 0) {
                $transaction->account->decrement('current_balance', (float) $transaction->credit);
            }
        }

        $this->deleteFor($reference);
    }

    private function record(Account $account, string $description, float $debit, float $credit, ?Model $reference): AccountTransaction
    {
        return AccountTransaction::create([
            'account_id' => $account->id,
            'user_id' => auth()->id(),
            'reference_type' => $reference ? $reference::class : null,
            'reference_id' => $reference?->getKey(),
            'transaction_date' => now(),
            'description' => $description,
            'debit' => $debit,
            'credit' => $credit,
            'balance_after' => $account->current_balance,
        ]);
    }
}
