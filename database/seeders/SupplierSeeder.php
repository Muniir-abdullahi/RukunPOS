<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        Supplier::updateOrCreate(
            ['name' => 'Sample Supplier'],
            ['company' => 'Rukun Wholesale', 'phone' => '+252611111111', 'email' => 'supplier@salelite.test', 'city' => 'Mogadishu', 'country' => 'Somalia', 'status' => 'active'],
        );
    }
}
