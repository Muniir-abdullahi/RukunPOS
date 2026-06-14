<?php

namespace App\Policies;

use App\Models\User;
use Spatie\Permission\Models\Role;

class RolePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('settings.manage');
    }

    public function view(User $user, Role $role): bool
    {
        return $user->can('settings.manage');
    }

    public function create(User $user): bool
    {
        return $user->can('settings.manage');
    }

    public function update(User $user, Role $role): bool
    {
        return $user->can('settings.manage');
    }

    public function delete(User $user, Role $role): bool
    {
        return $user->can('settings.manage') && $role->name !== 'Admin';
    }

    public function restore(User $user, Role $role): bool
    {
        return $user->can('settings.manage');
    }

    public function forceDelete(User $user, Role $role): bool
    {
        return $user->can('settings.manage') && $role->name !== 'Admin';
    }
}
