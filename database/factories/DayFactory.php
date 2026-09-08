<?php

namespace Database\Factories;

use App\Models\Day;
use App\Models\Level;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Day>
 */
class DayFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'level_id' => Level::factory(),
            'day_number' => fake()->unique()->numberBetween(1, 1000),
            'focus_text' => fake()->sentence(),
            'is_published' => true,
        ];
    }
}
