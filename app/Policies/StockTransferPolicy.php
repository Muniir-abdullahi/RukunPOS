<?php

namespace App\Policies;

use App\Models\StockTransfer;
use App\Models\User;

class StockTransferPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('inventory.transfer');
    }

    public function view(User $user, StockTransfer $stockTransfer): bool
    {
        return $user->can('inventory.transfer');
    }

    public function create(User $user): bool
    {
        return $user->can('inventory.transfer');
    }

    public function update(User $user, StockTransfer $stockTransfer): bool
    {
        return $user->can('inventory.transfer');
    }

    public function delete(User $user, StockTransfer $stockTransfer): bool
    {
        return $user->can('inventory.transfer');
    }

    public function restore(User $user, StockTransfer $stockTransfer): bool
    {
        return $user->can('inventory.transfer');
    }

    public function forceDelete(User $user, StockTransfer $stockTransfer): bool
    {
        return $user->can('inventory.transfer');
    }
}
