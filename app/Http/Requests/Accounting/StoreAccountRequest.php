<?php

namespace App\Http\Requests\Accounting;

use App\Models\Account;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Account::class);
    }

    public function rules(): array
    {
        return ['account_no' => ['nullable', 'string', 'max:255', Rule::unique('accounts', 'account_no')], 'name' => ['required', 'string', 'max:255'], 'type' => ['nullable', 'string', 'max:255'], 'opening_balance' => ['nullable', 'numeric', 'min:0'], 'status' => ['nullable', 'string', Rule::in(['active', 'inactive', 'Active', 'Inactive'])]];
    }
}
