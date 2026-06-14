<?php

namespace App\Policies;

use App\Models\StockAdjustment;
use App\Models\User;

class StockAdjustmentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('inventory.adjust');
    }

    public function view(User $user, StockAdjustment $stockAdjustment): bool
    {
        return $user->can('inventory.adjust');
    }

    public function create(User $user): bool
    {
        return $user->can('inventory.adjust');
    }

    public function update(User $user, StockAdjustment $stockAdjustment): bool
    {
        return $user->can('inventory.adjust');
    }

    public function delete(User $user, StockAdjustment $stockAdjustment): bool
    {
        return $user->can('inventory.adjust');
    }

    public function restore(User $user, StockAdjustment $stockAdjustment): bool
    {
        return $user->can('inventory.adjust');
    }

    public function forceDelete(User $user, StockAdjustment $stockAdjustment): bool
    {
        return $user->can('inventory.adjust');
    }
}
