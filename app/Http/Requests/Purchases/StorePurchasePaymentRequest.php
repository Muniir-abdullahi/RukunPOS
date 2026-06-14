<?php

namespace App\Http\Requests\Purchases;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePurchasePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('purchase'));
    }

    public function rules(): array
    {
        return ['account_id' => ['nullable', 'integer', Rule::exists('accounts', 'id')], 'amount' => ['required', 'numeric', 'min:0.01'], 'payment_method' => ['required', 'string', 'max:255'], 'reference' => ['nullable', 'string', 'max:255'], 'note' => ['nullable', 'string']];
    }
}
