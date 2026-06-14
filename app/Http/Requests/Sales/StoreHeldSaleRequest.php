<?php

namespace App\Http\Requests\Sales;

use App\Models\Sale;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreHeldSaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Sale::class);
    }

    public function rules(): array
    {
        return ['customer_id' => ['nullable', 'integer', Rule::exists('customers', 'id')], 'warehouse_id' => ['required', 'integer', Rule::exists('warehouses', 'id')], 'cart_snapshot' => ['required', 'array', 'min:1'], 'subtotal' => ['nullable', 'numeric', 'min:0'], 'tax_total' => ['nullable', 'numeric', 'min:0'], 'discount_total' => ['nullable', 'numeric', 'min:0'], 'grand_total' => ['nullable', 'numeric', 'min:0']];
    }
}
