<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Sony', 'Coca Cola', 'Rukun Essentials'] as $name) {
            Brand::updateOrCreate(['name' => $name], ['name' => $name, 'status' => 'active']);
        }
    }
}
