<?php

namespace App\Http\Requests\Sales;

use App\Models\Sale;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Sale::class);
    }

    public function rules(): array
    {
        return [
            'customer_id' => ['nullable', 'integer', Rule::exists('customers', 'id')],
            'warehouse_id' => ['required', 'integer', Rule::exists('warehouses', 'id')],
            'discount_total' => ['nullable', 'numeric', 'min:0'],
            'tax_total' => ['nullable', 'numeric', 'min:0'],
            'note' => ['nullable', 'string'],
            'cart' => ['required', 'array', 'min:1'],
            'cart.*.product_id' => ['required', 'integer', Rule::exists('products', 'id')],
            'cart.*.quantity' => ['required', 'numeric', 'min:0.001'],
            'cart.*.unit_price' => ['required', 'numeric', 'min:0'],
            'cart.*.tax_amount' => ['nullable', 'numeric', 'min:0'],
            'cart.*.discount_amount' => ['nullable', 'numeric', 'min:0'],
            'payments' => ['required', 'array', 'min:1'],
            'payments.*.account_id' => ['nullable', 'integer', Rule::exists('accounts', 'id')],
            'payments.*.method' => ['required', 'string', 'max:255'],
            'payments.*.amount' => ['required', 'numeric', 'min:0.01'],
            'payments.*.received_amount' => ['nullable', 'numeric', 'min:0'],
            'payments.*.reference' => ['nullable', 'string', 'max:255'],
        ];
    }
}
