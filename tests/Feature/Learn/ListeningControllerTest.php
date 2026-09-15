<?php

namespace Tests\Feature\Learn;

use App\Models\Day;
use App\Models\Level;
use App\Models\ListeningItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ListeningControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_show_requires_authentication()
    {
        $level = Level::factory()->create(['code' => 'A1']);
        Day::factory()->create(['level_id' => $level->id, 'day_number' => 1]);

        $this->get(route('learn.lessons.listening', ['A1', 1]))->assertRedirect(route('login'));
    }

    public function test_shows_the_listening_items_for_a_reachable_day()
    {
        $user = User::factory()->create();
        $level = Level::factory()->create(['code' => 'A1', 'is_published' => true]);
        $day = Day::factory()->create(['level_id' => $level->id, 'day_number' => 1, 'is_published' => true]);
        ListeningItem::create([
            'day_id' => $day->id,
            'type' => 'video',
            'video_url' => 'https://www.youtube.com/watch?v=abc123',
            'title' => 'Begrüßungen hören',
            'duration_label' => '3 min',
            'words' => [
                ['word' => 'die Begrüßung', 'pronounce' => 'dee beh-GROO-sung', 'meaning' => 'greeting'],
            ],
            'sort_order' => 1,
        ]);
        ListeningItem::create([
            'day_id' => $day->id,
            'type' => 'audio',
            'title' => 'Verabschiedungen hören',
            'duration_label' => '2 min',
            'sort_order' => 2,
        ]);

        $response = $this->actingAs($user)->get(route('learn.lessons.listening', ['A1', 1]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('learn/lessons/listening')
            ->has('listeningItems', 2)
            ->where('listeningItems.0.title', 'Begrüßungen hören')
            ->where('listeningItems.0.video_url', 'https://www.youtube.com/watch?v=abc123')
            ->where('listeningItems.0.words.0.word', 'die Begrüßung')
            ->where('listeningItems.1.title', 'Verabschiedungen hören'),
        );
    }

    public function test_redirects_to_the_roadmap_for_a_locked_day()
    {
        $user = User::factory()->create();
        $current = Level::factory()->create(['code' => 'A1', 'sort_order' => 1, 'is_published' => true]);
        Day::factory()->create(['level_id' => $current->id, 'day_number' => 1, 'is_published' => true]);
        $locked = Level::factory()->create(['code' => 'A2', 'sort_order' => 2, 'is_published' => true]);
        Day::factory()->create(['level_id' => $locked->id, 'day_number' => 1, 'is_published' => true]);

        $response = $this->actingAs($user)->get(route('learn.lessons.listening', ['A2', 1]));

        $response->assertRedirect(route('learn.lessons.roadmap', 'A2'));
    }
}
