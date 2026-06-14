<?php

namespace App\Http\Requests\Products;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('product'));
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:255', Rule::unique('products', 'sku')->ignore($this->route('product'))],
            'barcode' => ['nullable', 'string', 'max:255', Rule::unique('products', 'barcode')->ignore($this->route('product'))],
            'categoryId' => ['nullable', 'integer', Rule::exists('categories', 'id')],
            'brandId' => ['nullable', 'integer', Rule::exists('brands', 'id')],
            'unitId' => ['nullable', 'integer', Rule::exists('units', 'id')],
            'costPrice' => ['required', 'numeric', 'min:0'],
            'sellingPrice' => ['required', 'numeric', 'min:0'],
            'minStock' => ['nullable', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:2048'],
            'status' => ['nullable', 'string', Rule::in(['active', 'inactive', 'Active', 'Inactive'])],
        ];
    }
}
