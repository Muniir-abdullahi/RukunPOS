<?php

namespace App\Http\Requests\Expenses;

use App\Models\ExpenseCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreExpenseCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', ExpenseCategory::class);
    }

    public function rules(): array
    {
        return ['name' => ['required', 'string', 'max:255', Rule::unique('expense_categories', 'name')], 'description' => ['nullable', 'string'], 'status' => ['nullable', 'string', Rule::in(['active', 'inactive', 'Active', 'Inactive'])]];
    }
}
