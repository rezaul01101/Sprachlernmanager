<?php

namespace Tests\Feature\Admin;

use App\Models\Day;
use App\Models\Level;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ListeningControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_save_a_video_listening_item_with_a_youtube_link()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);

        $response = $this->actingAs($admin)->put(route('admin.levels.listening.update', [$level, $day]), [
            'type' => 'video',
            'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'script' => 'Guten Tag, wie kann ich Ihnen helfen?',
            'title' => 'Beim Bürgeramt',
            'duration_label' => '02:14',
            'question' => 'Was muss die Person mitbringen?',
            'options' => [
                ['text' => 'Ausweis', 'is_correct' => true, 'explanation' => null],
            ],
        ]);

        $response->assertRedirect(route('admin.levels.listening.edit', [$level, $day]));
        $this->assertDatabaseHas('listening_items', [
            'day_id' => $day->id,
            'type' => 'video',
            'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'script' => 'Guten Tag, wie kann ich Ihnen helfen?',
        ]);
    }

    public function test_script_is_optional()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);

        $response = $this->actingAs($admin)->put(route('admin.levels.listening.update', [$level, $day]), [
            'type' => 'audio',
            'title' => 'Beim Bürgeramt',
            'duration_label' => '02:14',
            'question' => 'Was muss die Person mitbringen?',
            'options' => [
                ['text' => 'Ausweis', 'is_correct' => true],
            ],
        ]);

        $response->assertRedirect(route('admin.levels.listening.edit', [$level, $day]));
        $this->assertDatabaseHas('listening_items', [
            'day_id' => $day->id,
            'script' => null,
        ]);
    }

    public function test_video_url_is_required_when_type_is_video()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);

        $response = $this->actingAs($admin)->put(route('admin.levels.listening.update', [$level, $day]), [
            'type' => 'video',
            'title' => 'Beim Bürgeramt',
            'duration_label' => '02:14',
            'question' => 'Was muss die Person mitbringen?',
            'options' => [
                ['text' => 'Ausweis', 'is_correct' => true],
            ],
        ]);

        $response->assertSessionHasErrors('video_url');
    }

    public function test_video_url_is_optional_when_type_is_audio()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);

        $response = $this->actingAs($admin)->put(route('admin.levels.listening.update', [$level, $day]), [
            'type' => 'audio',
            'title' => 'Beim Bürgeramt',
            'duration_label' => '02:14',
            'question' => 'Was muss die Person mitbringen?',
            'options' => [
                ['text' => 'Ausweis', 'is_correct' => true],
            ],
        ]);

        $response->assertRedirect(route('admin.levels.listening.edit', [$level, $day]));
        $this->assertDatabaseHas('listening_items', [
            'day_id' => $day->id,
            'type' => 'audio',
            'video_url' => null,
        ]);
    }
}
