<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Expense>
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
            'expense_date' => $this->faker->date(),
            'amount' => $this->faker->randomFloat(2, 10, 500),
            'note' => $this->faker->sentence(),
        ];
    }
}
