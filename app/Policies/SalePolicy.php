<?php

namespace App\Policies;

use App\Models\Sale;
use App\Models\User;

class SalePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('sales.manage');
    }

    public function view(User $user, Sale $sale): bool
    {
        return $user->can('sales.manage');
    }

    public function create(User $user): bool
    {
        return $user->can('sales.manage');
    }

    public function update(User $user, Sale $sale): bool
    {
        return $user->can('sales.manage');
    }

    public function delete(User $user, Sale $sale): bool
    {
        return $user->can('sales.manage');
    }
}
