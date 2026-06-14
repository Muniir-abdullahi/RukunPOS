<?php

namespace App\Http\Requests\Purchases;

use App\Models\PurchaseReturn;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePurchaseReturnRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', PurchaseReturn::class);
    }

    public function rules(): array
    {
        return ['purchase_id' => ['nullable', 'integer', Rule::exists('purchases', 'id')], 'supplier_id' => ['nullable', 'integer', Rule::exists('suppliers', 'id')], 'warehouse_id' => ['required', 'integer', Rule::exists('warehouses', 'id')], 'return_date' => ['nullable', 'date'], 'note' => ['nullable', 'string'], 'items' => ['required', 'array', 'min:1'], 'items.*.product_id' => ['required', 'integer', Rule::exists('products', 'id')], 'items.*.quantity' => ['required', 'numeric', 'min:0.001'], 'items.*.unit_cost' => ['required', 'numeric', 'min:0']];
    }
}
