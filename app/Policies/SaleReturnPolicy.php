<?php

namespace App\Policies;

use App\Models\SaleReturn;
use App\Models\User;

class SaleReturnPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('sales.return');
    }

    public function view(User $user, SaleReturn $saleReturn): bool
    {
        return $user->can('sales.return');
    }

    public function create(User $user): bool
    {
        return $user->can('sales.return');
    }

    public function update(User $user, SaleReturn $saleReturn): bool
    {
        return $user->can('sales.return');
    }

    public function delete(User $user, SaleReturn $saleReturn): bool
    {
        return $user->can('sales.return');
    }
}
