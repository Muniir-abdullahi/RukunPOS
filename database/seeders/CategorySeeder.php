<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            ['name' => 'Drinks', 'code' => 'DRN'],
            ['name' => 'Snacks', 'code' => 'SNK'],
            ['name' => 'Electronics', 'code' => 'ELEC'],
            ['name' => 'Grocery', 'code' => 'GRO'],
            ['name' => 'Pharmacy', 'code' => 'PHA'],
        ] as $category) {
            Category::updateOrCreate(['code' => $category['code']], [...$category, 'status' => 'active']);
        }
    }
}
