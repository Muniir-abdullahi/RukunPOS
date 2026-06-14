<?php

namespace App\Http\Requests\People;

class UpdateCustomerRequest extends StoreCustomerRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('customer'));
    }
}
