<?php

namespace App\Http\Requests\Expenses;

class UpdateExpenseRequest extends StoreExpenseRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('expense'));
    }
}
