<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Quotation;
use App\Models\QuotationItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<QuotationItem>
 */
class QuotationItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'quotation_id' => Quotation::factory(),
            'product_id' => Product::factory(),
            'quantity' => $this->faker->randomFloat(2, 1, 20),
            'unit_price' => $this->faker->randomFloat(2, 10, 200),
            'unit_cost' => $this->faker->randomFloat(2, 5, 100),
            'tax_amount' => 0,
            'discount_amount' => 0,
            'line_total' => $this->faker->randomFloat(2, 10, 4000),
        ];
    }
}
