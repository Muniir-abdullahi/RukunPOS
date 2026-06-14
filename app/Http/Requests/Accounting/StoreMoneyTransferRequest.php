<?php

namespace App\Http\Requests\Accounting;

use App\Models\MoneyTransfer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMoneyTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', MoneyTransfer::class);
    }

    public function rules(): array
    {
        return ['from_account_id' => ['required', 'integer', Rule::exists('accounts', 'id'), 'different:to_account_id'], 'to_account_id' => ['required', 'integer', Rule::exists('accounts', 'id')], 'transfer_date' => ['nullable', 'date'], 'amount' => ['required', 'numeric', 'min:0.01'], 'note' => ['nullable', 'string']];
    }
}
