<?php

namespace Database\Factories;

use App\Models\Account;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Account>
 */
class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'account_no' => $this->faker->unique()->bankAccountNumber(),
            'name' => $this->faker->word().' Account',
            'opening_balance' => $this->faker->randomFloat(2, 0, 1000),
            'current_balance' => $this->faker->randomFloat(2, 0, 5000),
            'status' => 'active',
        ];
    }
}
