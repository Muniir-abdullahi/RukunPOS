<?php

namespace Database\Seeders;

use App\Models\Warehouse;
use Illuminate\Database\Seeder;

class WarehouseSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            ['name' => 'Main Warehouse', 'phone' => '+252610000001', 'email' => 'main@salelite.test', 'city' => 'Mogadishu', 'status' => 'active'],
            ['name' => 'Store Front', 'city' => 'Mogadishu', 'status' => 'active'],
        ] as $warehouse) {
            Warehouse::updateOrCreate(['name' => $warehouse['name']], $warehouse);
        }
    }
}
