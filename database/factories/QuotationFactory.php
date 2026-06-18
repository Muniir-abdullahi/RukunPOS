<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Quotation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Quotation>
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
            'reference' => 'QT-'.$this->faker->unique()->randomNumber(6),
            'customer_id' => Customer::factory(),
            'quotation_date' => $this->faker->date(),
            'status' => 'pending',
            'tax_total' => 0,
            'discount_total' => 0,
            'subtotal' => $this->faker->randomFloat(2, 50, 1000),
            'grand_total' => $this->faker->randomFloat(2, 50, 1000),
            'note' => $this->faker->sentence(),
        ];
    }
}
