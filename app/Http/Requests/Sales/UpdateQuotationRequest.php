<?php

namespace App\Http\Requests\Sales;

class UpdateQuotationRequest extends StoreQuotationRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('quotation'));
    }
}
