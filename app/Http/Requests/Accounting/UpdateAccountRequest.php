<?php

namespace App\Http\Requests\Accounting;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('account'));
    }

    public function rules(): array
    {
        return ['account_no' => ['nullable', 'string', 'max:255', Rule::unique('accounts', 'account_no')->ignore($this->route('account'))], 'name' => ['required', 'string', 'max:255'], 'type' => ['nullable', 'string', 'max:255'], 'opening_balance' => ['nullable', 'numeric', 'min:0'], 'status' => ['nullable', 'string', Rule::in(['active', 'inactive', 'Active', 'Inactive'])]];
    }
}
