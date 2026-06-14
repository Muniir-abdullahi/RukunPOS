<?php

namespace App\Policies;

use App\Models\MoneyTransfer;
use App\Models\User;

class MoneyTransferPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('accounting.manage');
    }

    public function view(User $user, MoneyTransfer $moneyTransfer): bool
    {
        return $user->can('accounting.manage');
    }

    public function create(User $user): bool
    {
        return $user->can('accounting.manage');
    }

    public function update(User $user, MoneyTransfer $moneyTransfer): bool
    {
        return $user->can('accounting.manage');
    }

    public function delete(User $user, MoneyTransfer $moneyTransfer): bool
    {
        return $user->can('accounting.manage');
    }
}
