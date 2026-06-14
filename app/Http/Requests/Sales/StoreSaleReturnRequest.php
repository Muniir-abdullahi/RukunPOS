<?php

namespace App\Http\Requests\Sales;

use App\Models\SaleReturn;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSaleReturnRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', SaleReturn::class);
    }

    public function rules(): array
    {
        return ['sale_id' => ['nullable', 'integer', Rule::exists('sales', 'id')], 'customer_id' => ['nullable', 'integer', Rule::exists('customers', 'id')], 'warehouse_id' => ['required', 'integer', Rule::exists('warehouses', 'id')], 'return_date' => ['nullable', 'date'], 'refund_method' => ['nullable', 'string', 'max:255'], 'account_id' => ['nullable', 'integer', Rule::exists('accounts', 'id')], 'note' => ['nullable', 'string'], 'items' => ['required', 'array', 'min:1'], 'items.*.sale_item_id' => ['nullable', 'integer', Rule::exists('sale_items', 'id')], 'items.*.product_id' => ['required', 'integer', Rule::exists('products', 'id')], 'items.*.quantity' => ['required', 'numeric', 'min:0.001'], 'items.*.unit_price' => ['required', 'numeric', 'min:0']];
    }
}
