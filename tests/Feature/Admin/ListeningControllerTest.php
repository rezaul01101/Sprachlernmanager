<?php

namespace Tests\Feature\Admin;

use App\Models\Day;
use App\Models\Level;
use App\Models\ListeningItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ListeningControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_the_listening_day_grid_for_a_level()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        Day::factory()->count(3)->create(['level_id' => $level->id]);

        $response = $this->actingAs($admin)->get(route('admin.levels.listening.index', $level));

        $response->assertOk();
    }

    public function test_admin_can_view_a_days_existing_listening_items()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);
        ListeningItem::factory()->create(['day_id' => $day->id, 'title' => 'Beim Bürgeramt']);

        $response = $this->actingAs($admin)->get(route('admin.levels.listening.edit', [$level, $day]));

        $response->assertOk();
    }

    public function test_saving_listening_replaces_the_days_existing_items()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);
        ListeningItem::factory()->create(['day_id' => $day->id, 'title' => 'old-title']);

        $response = $this->actingAs($admin)->put(route('admin.levels.listening.update', [$level, $day]), [
            'items' => [
                [
                    'type' => 'video',
                    'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    'script' => 'Guten Tag, wie kann ich Ihnen helfen?',
                    'title' => 'Beim Bürgeramt – Anmeldung',
                    'duration_label' => '02:14',
                    'words' => [
                        ['word' => 'der Ausweis', 'pronounce' => 'dehr OWS-vice', 'meaning' => 'ID card'],
                        ['word' => 'anmelden', 'pronounce' => 'AN-mel-den', 'meaning' => 'to register'],
                    ],
                ],
                [
                    'type' => 'audio',
                    'title' => 'Beim Bürgeramt – Der Termin',
                    'duration_label' => '01:45',
                    'words' => [
                        ['word' => 'der Termin'],
                    ],
                ],
            ],
        ]);

        $response->assertRedirect(route('admin.levels.listening.edit', [$level, $day]));
        $this->assertDatabaseMissing('listening_items', ['title' => 'old-title']);
        $this->assertDatabaseHas('listening_items', [
            'day_id' => $day->id,
            'type' => 'video',
            'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'script' => 'Guten Tag, wie kann ich Ihnen helfen?',
            'title' => 'Beim Bürgeramt – Anmeldung',
            'words' => json_encode([
                ['word' => 'der Ausweis', 'pronounce' => 'dehr OWS-vice', 'meaning' => 'ID card'],
                ['word' => 'anmelden', 'pronounce' => 'AN-mel-den', 'meaning' => 'to register'],
            ]),
            'sort_order' => 1,
        ]);
        $this->assertDatabaseHas('listening_items', [
            'day_id' => $day->id,
            'type' => 'audio',
            'video_url' => null,
            'title' => 'Beim Bürgeramt – Der Termin',
            'words' => json_encode([
                ['word' => 'der Termin', 'pronounce' => null, 'meaning' => null],
            ]),
            'sort_order' => 2,
        ]);
    }

    public function test_script_is_optional()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);

        $response = $this->actingAs($admin)->put(route('admin.levels.listening.update', [$level, $day]), [
            'items' => [
                ['type' => 'audio', 'title' => 'Beim Bürgeramt', 'duration_label' => '02:14', 'words' => []],
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
            'items' => [
                ['type' => 'video', 'title' => 'Beim Bürgeramt', 'duration_label' => '02:14', 'words' => []],
            ],
        ]);

        $response->assertSessionHasErrors('items.0.video_url');
    }

    public function test_video_url_is_optional_when_type_is_audio()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);

        $response = $this->actingAs($admin)->put(route('admin.levels.listening.update', [$level, $day]), [
            'items' => [
                ['type' => 'audio', 'title' => 'Beim Bürgeramt', 'duration_label' => '02:14', 'words' => []],
            ],
        ]);

        $response->assertRedirect(route('admin.levels.listening.edit', [$level, $day]));
        $this->assertDatabaseHas('listening_items', [
            'day_id' => $day->id,
            'type' => 'audio',
            'video_url' => null,
        ]);
    }

    public function test_saving_an_empty_items_array_clears_the_days_listening_items()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);
        ListeningItem::factory()->create(['day_id' => $day->id]);

        $response = $this->actingAs($admin)->put(route('admin.levels.listening.update', [$level, $day]), [
            'items' => [],
        ]);

        $response->assertRedirect(route('admin.levels.listening.edit', [$level, $day]));
        $this->assertDatabaseCount('listening_items', 0);
    }
}
