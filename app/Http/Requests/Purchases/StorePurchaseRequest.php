<?php

namespace App\Http\Requests\Purchases;

use App\Models\Purchase;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePurchaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Purchase::class);
    }

    public function rules(): array
    {
        return [
            'supplier_id' => ['nullable', 'integer', Rule::exists('suppliers', 'id')],
            'warehouse_id' => ['required', 'integer', Rule::exists('warehouses', 'id')],
            'purchase_date' => ['nullable', 'date'],
            'status' => ['nullable', 'string', Rule::in(['pending', 'ordered', 'received', 'cancelled'])],
            'payment_status' => ['nullable', 'string', Rule::in(['unpaid', 'partial', 'paid'])],
            'shipping_total' => ['nullable', 'numeric', 'min:0'],
            'note' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', Rule::exists('products', 'id')],
            'items.*.quantity' => ['required', 'numeric', 'min:0.001'],
            'items.*.unit_cost' => ['required', 'numeric', 'min:0'],
            'items.*.tax_amount' => ['nullable', 'numeric', 'min:0'],
            'items.*.discount_amount' => ['nullable', 'numeric', 'min:0'],
            'payment' => ['nullable', 'array'],
            'payment.account_id' => ['nullable', 'integer', Rule::exists('accounts', 'id')],
            'payment.amount' => ['nullable', 'numeric', 'min:0.01'],
            'payment.payment_method' => ['nullable', 'string', 'max:255'],
            'payment.reference' => ['nullable', 'string', 'max:255'],
            'payment.note' => ['nullable', 'string'],
        ];
    }
}
