<?php

namespace Database\Factories;

use App\Models\Day;
use App\Models\VocabCard;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<VocabCard>
 */
class VocabCardFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'day_id' => Day::factory(),
            'word' => fake()->word(),
            'tag' => 'Substantiv · n.',
            'translation_en' => fake()->word(),
            'translation_bn' => null,
            'example' => fake()->sentence(),
            'sort_order' => fake()->unique()->numberBetween(1, 1000),
        ];
    }
}
