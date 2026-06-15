<?php

namespace Database\Seeders;

use App\Models\CustomerGroup;
use Illuminate\Database\Seeder;

class CustomerGroupSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Regular', 'VIP'] as $name) {
            CustomerGroup::updateOrCreate(['name' => $name], ['name' => $name, 'status' => 'active']);
        }
    }
}
