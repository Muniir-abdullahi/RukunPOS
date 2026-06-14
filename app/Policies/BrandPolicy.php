<?php

namespace App\Policies;

use App\Models\Brand;
use App\Models\User;

class BrandPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('products.view');
    }

    public function view(User $user, Brand $brand): bool
    {
        return $user->can('products.view');
    }

    public function create(User $user): bool
    {
        return $user->can('products.create');
    }

    public function update(User $user, Brand $brand): bool
    {
        return $user->can('products.update');
    }

    public function delete(User $user, Brand $brand): bool
    {
        return $user->can('products.delete');
    }

    public function restore(User $user, Brand $brand): bool
    {
        return $user->can('products.update');
    }

    public function forceDelete(User $user, Brand $brand): bool
    {
        return $user->can('products.delete');
    }
}
