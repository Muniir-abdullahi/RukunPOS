<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Warehouse;

class WarehousePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('settings.manage');
    }

    public function view(User $user, Warehouse $warehouse): bool
    {
        return $user->can('settings.manage');
    }

    public function create(User $user): bool
    {
        return $user->can('settings.manage');
    }

    public function update(User $user, Warehouse $warehouse): bool
    {
        return $user->can('settings.manage');
    }

    public function delete(User $user, Warehouse $warehouse): bool
    {
        return $user->can('settings.manage');
    }

    public function restore(User $user, Warehouse $warehouse): bool
    {
        return $user->can('settings.manage');
    }

    public function forceDelete(User $user, Warehouse $warehouse): bool
    {
        return $user->can('settings.manage');
    }
}
