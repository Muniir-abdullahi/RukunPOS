<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
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
            'name' => $this->faker->word() . ' Account',
            'initial_balance' => $this->faker->randomFloat(2, 0, 1000),
            'current_balance' => $this->faker->randomFloat(2, 0, 5000),
            'note' => $this->faker->sentence(),
            'is_default' => false,
            'status' => 'active',
        ];
    }
}
