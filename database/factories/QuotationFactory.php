<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Customer;
use App\Models\Warehouse;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Quotation>
 */
class QuotationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reference' => 'QT-' . $this->faker->unique()->randomNumber(6),
            'customer_id' => Customer::factory(),
            'warehouse_id' => Warehouse::factory(),
            'quotation_date' => $this->faker->date(),
            'status' => 'pending',
            'tax_amount' => 0,
            'discount_amount' => 0,
            'shipping_amount' => 0,
            'subtotal' => $this->faker->randomFloat(2, 50, 1000),
            'grand_total' => $this->faker->randomFloat(2, 50, 1000),
            'note' => $this->faker->sentence(),
        ];
    }
}
