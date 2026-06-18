<?php

namespace Database\Factories;

use App\Models\Purchase;
use App\Models\Supplier;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Purchase>
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
            'reference' => 'PR-'.$this->faker->unique()->randomNumber(6),
            'supplier_id' => Supplier::factory(),
            'warehouse_id' => Warehouse::factory(),
            'purchase_date' => $this->faker->date(),
            'status' => 'received',
            'payment_status' => 'paid',
            'tax_total' => 0,
            'discount_total' => 0,
            'subtotal' => $this->faker->randomFloat(2, 100, 1000),
            'grand_total' => $this->faker->randomFloat(2, 100, 1000),
            'paid_total' => $this->faker->randomFloat(2, 100, 1000),
            'due_total' => 0,
            'note' => $this->faker->sentence(),
        ];
    }
}
