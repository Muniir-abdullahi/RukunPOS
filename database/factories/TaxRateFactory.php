<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TaxRate>
 */
class TaxRateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Tax ' . $this->faker->numberBetween(5, 20) . '%',
            'rate' => $this->faker->randomFloat(2, 5, 20),
            'type' => 'percentage',
            'status' => 'active',
        ];
    }
}
