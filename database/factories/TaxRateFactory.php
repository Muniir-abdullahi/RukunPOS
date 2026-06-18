<?php

namespace Database\Factories;

use App\Models\TaxRate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TaxRate>
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
            'name' => 'Tax '.$this->faker->unique()->numberBetween(1, 1000).'%',
            'rate' => $this->faker->randomFloat(2, 5, 20),
            'status' => 'active',
        ];
    }
}
