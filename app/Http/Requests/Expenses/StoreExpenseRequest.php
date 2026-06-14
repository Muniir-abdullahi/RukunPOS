<?php

namespace App\Http\Requests\Expenses;

use App\Models\Expense;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Expense::class);
    }

    public function rules(): array
    {
        return ['expense_category_id' => ['nullable', 'integer', Rule::exists('expense_categories', 'id')], 'account_id' => ['required', 'integer', Rule::exists('accounts', 'id')], 'expense_date' => ['nullable', 'date'], 'amount' => ['required', 'numeric', 'min:0.01'], 'note' => ['nullable', 'string']];
    }
}
