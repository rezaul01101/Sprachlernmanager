<?php

namespace Database\Factories;

use App\Models\Grammar;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Grammar>
 */
class GrammarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->words(3, true),
            'description' => '<p>'.fake()->sentence().'</p>',
        ];
    }
}
