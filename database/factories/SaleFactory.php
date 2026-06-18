<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Sale;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Sale>
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
            'reference' => 'SL-'.$this->faker->unique()->randomNumber(6),
            'customer_id' => Customer::factory(),
            'warehouse_id' => Warehouse::factory(),
            'sale_date' => $this->faker->date(),
            'status' => 'completed',
            'payment_status' => 'paid',
            'tax_total' => 0,
            'discount_total' => 0,
            'subtotal' => $this->faker->randomFloat(2, 50, 1000),
            'grand_total' => $this->faker->randomFloat(2, 50, 1000),
            'paid_total' => $this->faker->randomFloat(2, 50, 1000),
            'due_total' => 0,
            'note' => $this->faker->sentence(),
        ];
    }
}
