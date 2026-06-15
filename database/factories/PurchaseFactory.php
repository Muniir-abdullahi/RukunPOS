<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Supplier;
use App\Models\Warehouse;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Purchase>
 */
class PurchaseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reference' => 'PR-' . $this->faker->unique()->randomNumber(6),
            'supplier_id' => Supplier::factory(),
            'warehouse_id' => Warehouse::factory(),
            'purchase_date' => $this->faker->date(),
            'status' => 'received',
            'payment_status' => 'paid',
            'tax_amount' => 0,
            'discount_amount' => 0,
            'shipping_amount' => 0,
            'subtotal' => $this->faker->randomFloat(2, 100, 1000),
            'grand_total' => $this->faker->randomFloat(2, 100, 1000),
            'paid_amount' => $this->faker->randomFloat(2, 100, 1000),
            'due_amount' => 0,
            'note' => $this->faker->sentence(),
        ];
    }
}
