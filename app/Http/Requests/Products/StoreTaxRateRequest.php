<?php

namespace App\Http\Requests\Products;

use App\Models\TaxRate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaxRateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', TaxRate::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('tax_rates', 'name')],
            'rate' => ['required', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', Rule::in(['active', 'inactive', 'Active', 'Inactive'])],
        ];
    }
}
