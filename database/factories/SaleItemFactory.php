<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SaleItem>
 */
class SaleItemFactory extends Factory
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
