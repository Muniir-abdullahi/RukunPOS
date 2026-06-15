<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Customer;
use App\Models\Warehouse;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sale>
 */
class SaleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reference' => 'SL-' . $this->faker->unique()->randomNumber(6),
            'customer_id' => Customer::factory(),
            'warehouse_id' => Warehouse::factory(),
            'sale_date' => $this->faker->date(),
            'status' => 'completed',
            'payment_status' => 'paid',
            'tax_amount' => 0,
            'discount_amount' => 0,
            'shipping_amount' => 0,
            'subtotal' => $this->faker->randomFloat(2, 50, 1000),
            'grand_total' => $this->faker->randomFloat(2, 50, 1000),
            'paid_amount' => $this->faker->randomFloat(2, 50, 1000),
            'due_amount' => 0,
            'note' => $this->faker->sentence(),
        ];
    }
}
