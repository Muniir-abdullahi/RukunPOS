<?php

namespace App\Http\Requests\Products;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaxRateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('taxRate'));
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('tax_rates', 'name')->ignore($this->route('taxRate'))],
            'rate' => ['required', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', Rule::in(['active', 'inactive', 'Active', 'Inactive'])],
        ];
    }
}
