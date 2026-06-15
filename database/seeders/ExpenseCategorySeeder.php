<?php

namespace Database\Seeders;

use App\Models\ExpenseCategory;
use Illuminate\Database\Seeder;

class ExpenseCategorySeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Rent', 'Utilities', 'Salaries', 'Transport'] as $name) {
            ExpenseCategory::updateOrCreate(['name' => $name], ['name' => $name, 'status' => 'active']);
        }
    }
}
