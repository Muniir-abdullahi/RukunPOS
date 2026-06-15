<?php

namespace Database\Seeders;

use App\Models\Account;
use Illuminate\Database\Seeder;

class AccountSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            ['account_no' => 'AC-001', 'name' => 'Cash', 'type' => 'cash', 'opening_balance' => 5000, 'current_balance' => 5000, 'status' => 'active'],
            ['account_no' => 'AC-002', 'name' => 'Bank Account', 'type' => 'bank', 'opening_balance' => 15400.50, 'current_balance' => 15400.50, 'status' => 'active'],
            ['account_no' => 'AC-003', 'name' => 'EVC Plus', 'type' => 'mobile_money', 'opening_balance' => 0, 'current_balance' => 0, 'status' => 'active'],
        ] as $account) {
            Account::updateOrCreate(['account_no' => $account['account_no']], $account);
        }
    }
}
