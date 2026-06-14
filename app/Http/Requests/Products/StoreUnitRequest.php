<?php

namespace App\Http\Requests\Products;

use App\Models\Unit;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Unit::class);
    }

    public function rules(): array
    {
        return [
            'base_unit_id' => ['nullable', 'integer', Rule::exists('units', 'id')],
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'required_without:shortName', 'string', 'max:255', Rule::unique('units', 'code')],
            'shortName' => ['nullable', 'required_without:code', 'string', 'max:255'],
            'short_name' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', Rule::in(['active', 'inactive', 'Active', 'Inactive'])],
        ];
    }
}
