<?php

namespace Tests\Feature\Admin;

use App\Models\Day;
use App\Models\Level;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SpeakingControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_save_a_speaking_item_with_dialogue_and_words()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);

        $response = $this->actingAs($admin)->put(route('admin.levels.speaking.update', [$level, $day]), [
            'dialogue' => [
                ['german' => 'Guten Tag!', 'english' => 'Good day!', 'pronounce' => 'গুটেন টাক!'],
            ],
            'words' => [
                ['german' => 'der Termin', 'english' => 'appointment', 'pronounce' => 'ডেয়া টারমিন'],
            ],
        ]);

        $response->assertRedirect(route('admin.levels.speaking.edit', [$level, $day]));
        $this->assertDatabaseHas('speaking_items', [
            'day_id' => $day->id,
            'dialogue' => json_encode([
                ['german' => 'Guten Tag!', 'english' => 'Good day!', 'pronounce' => 'গুটেন টাক!'],
            ]),
            'words' => json_encode([
                ['german' => 'der Termin', 'english' => 'appointment', 'pronounce' => 'ডেয়া টারমিন'],
            ]),
        ]);
    }

    public function test_words_are_optional()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);

        $response = $this->actingAs($admin)->put(route('admin.levels.speaking.update', [$level, $day]), [
            'dialogue' => [
                ['german' => 'Guten Tag!', 'english' => 'Good day!'],
            ],
            'words' => [],
        ]);

        $response->assertRedirect(route('admin.levels.speaking.edit', [$level, $day]));
        $this->assertDatabaseHas('speaking_items', [
            'day_id' => $day->id,
            'words' => json_encode([]),
        ]);
    }

    public function test_dialogue_is_required()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);

        $response = $this->actingAs($admin)->put(route('admin.levels.speaking.update', [$level, $day]), [
            'dialogue' => [],
            'words' => [],
        ]);

        $response->assertSessionHasErrors('dialogue');
    }
}
