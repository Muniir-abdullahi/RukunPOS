<?php

namespace App\Http\Requests\Expenses;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateExpenseCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('expenseCategory'));
    }

    public function rules(): array
    {
        return ['name' => ['required', 'string', 'max:255', Rule::unique('expense_categories', 'name')->ignore($this->route('expenseCategory'))], 'description' => ['nullable', 'string'], 'status' => ['nullable', 'string', Rule::in(['active', 'inactive', 'Active', 'Inactive'])]];
    }
}
