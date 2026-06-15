<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            ['name' => 'Piece', 'code' => 'pcs', 'short_name' => 'pcs'],
            ['name' => 'Kilogram', 'code' => 'kg', 'short_name' => 'kg'],
            ['name' => 'Liter', 'code' => 'ltr', 'short_name' => 'ltr'],
        ] as $unit) {
            Unit::updateOrCreate(['code' => $unit['code']], [...$unit, 'status' => 'active']);
        }
    }
}
