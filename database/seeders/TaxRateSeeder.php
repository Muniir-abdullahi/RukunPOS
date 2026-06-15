<?php

namespace Database\Seeders;

use App\Models\TaxRate;
use Illuminate\Database\Seeder;

class TaxRateSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            ['name' => 'No Tax', 'rate' => 0.00, 'status' => 'active'],
            ['name' => 'VAT 10%', 'rate' => 10.00, 'status' => 'active'],
        ] as $rate) {
            TaxRate::updateOrCreate(['name' => $rate['name']], $rate);
        }
    }
}
