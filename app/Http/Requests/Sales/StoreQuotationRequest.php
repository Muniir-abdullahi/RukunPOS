<?php

namespace App\Http\Requests\Sales;

use App\Models\Quotation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreQuotationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Quotation::class);
    }

    public function rules(): array
    {
        return ['customer_id' => ['nullable', 'integer', Rule::exists('customers', 'id')], 'quotation_date' => ['nullable', 'date'], 'status' => ['nullable', 'string', Rule::in(['pending', 'sent', 'accepted', 'declined', 'converted'])], 'discount_total' => ['nullable', 'numeric', 'min:0'], 'tax_total' => ['nullable', 'numeric', 'min:0'], 'note' => ['nullable', 'string'], 'items' => ['required', 'array', 'min:1'], 'items.*.product_id' => ['required', 'integer', Rule::exists('products', 'id')], 'items.*.quantity' => ['required', 'numeric', 'min:0.001'], 'items.*.unit_price' => ['required', 'numeric', 'min:0'], 'items.*.tax_amount' => ['nullable', 'numeric', 'min:0'], 'items.*.discount_amount' => ['nullable', 'numeric', 'min:0']];
    }
}
