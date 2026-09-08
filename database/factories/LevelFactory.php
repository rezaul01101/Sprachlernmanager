<?php

namespace Database\Factories;

use App\Models\Level;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Level>
 */
class LevelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => fake()->unique()->lexify('??'),
            'title' => fake()->words(2, true),
            'description' => fake()->optional()->sentence(),
            'sort_order' => fake()->unique()->numberBetween(1, 1000),
            'is_published' => true,
        ];
    }
}
