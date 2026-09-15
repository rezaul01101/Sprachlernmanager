<?php

namespace Database\Factories;

use App\Models\Day;
use App\Models\ListeningItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ListeningItem>
 */
class ListeningItemFactory extends Factory
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
            'type' => 'video',
            'video_url' => null,
            'script' => null,
            'title' => fake()->sentence(3),
            'duration_label' => '00:00',
            'words' => [],
            'sort_order' => fake()->unique()->numberBetween(1, 1000),
        ];
    }
}
