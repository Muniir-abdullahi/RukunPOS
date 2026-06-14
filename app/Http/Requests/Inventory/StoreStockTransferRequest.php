<?php

namespace App\Http\Requests\Inventory;

use App\Models\StockTransfer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStockTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', StockTransfer::class);
    }

    public function rules(): array
    {
        return [
            'from_warehouse_id' => ['required', 'integer', Rule::exists('warehouses', 'id'), 'different:to_warehouse_id'],
            'to_warehouse_id' => ['required', 'integer', Rule::exists('warehouses', 'id')],
            'date' => ['nullable', 'date'],
            'status' => ['nullable', 'string', Rule::in(['pending', 'completed'])],
            'note' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', Rule::exists('products', 'id')],
            'items.*.quantity' => ['required', 'numeric', 'min:0.001'],
        ];
    }
}
