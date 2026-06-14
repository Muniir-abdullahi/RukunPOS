<?php

namespace App\Http\Requests\People;

use App\Models\CustomerGroup;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCustomerGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', CustomerGroup::class);
    }

    public function rules(): array
    {
        return ['name' => ['required', 'string', 'max:255', Rule::unique('customer_groups', 'name')], 'description' => ['nullable', 'string'], 'status' => ['nullable', 'string', Rule::in(['active', 'inactive', 'Active', 'Inactive'])]];
    }
}
