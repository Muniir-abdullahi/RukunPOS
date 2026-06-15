<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        Customer::updateOrCreate(
            ['name' => 'Walk-in Customer'],
            ['customer_group_id' => null, 'email' => null, 'phone' => null, 'status' => 'active'],
        );
    }
}
