<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ExpenseCategory;
use App\Models\Account;
use App\Models\Warehouse;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Expense>
 */
class ExpenseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'expense_category_id' => ExpenseCategory::factory(),
            'account_id' => Account::factory(),
            'warehouse_id' => Warehouse::factory(),
            'expense_date' => $this->faker->date(),
            'amount' => $this->faker->randomFloat(2, 10, 500),
            'note' => $this->faker->sentence(),
        ];
    }
}
