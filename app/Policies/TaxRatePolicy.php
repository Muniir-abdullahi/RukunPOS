<?php

namespace App\Policies;

use App\Models\TaxRate;
use App\Models\User;

class TaxRatePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('products.view');
    }

    public function view(User $user, TaxRate $taxRate): bool
    {
        return $user->can('products.view');
    }

    public function create(User $user): bool
    {
        return $user->can('products.create');
    }

    public function update(User $user, TaxRate $taxRate): bool
    {
        return $user->can('products.update');
    }

    public function delete(User $user, TaxRate $taxRate): bool
    {
        return $user->can('products.delete');
    }

    public function restore(User $user, TaxRate $taxRate): bool
    {
        return $user->can('products.update');
    }

    public function forceDelete(User $user, TaxRate $taxRate): bool
    {
        return $user->can('products.delete');
    }
}
