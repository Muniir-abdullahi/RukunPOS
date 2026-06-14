<?php

namespace App\Http\Requests\Purchases;

class UpdatePurchaseRequest extends StorePurchaseRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('purchase'));
    }
}
