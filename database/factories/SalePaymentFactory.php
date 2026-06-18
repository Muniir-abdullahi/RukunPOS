<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\Sale;
use App\Models\SalePayment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SalePayment>
 */
class SalePaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'sale_id' => Sale::factory(),
            'account_id' => Account::factory(),
            'amount' => $this->faker->randomFloat(2, 10, 1000),
            'method' => 'cash',
            'payment_date' => $this->faker->date(),
        ];
    }
}
