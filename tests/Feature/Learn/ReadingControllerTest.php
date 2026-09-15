<?php

namespace Tests\Feature\Learn;

use App\Models\Day;
use App\Models\Level;
use App\Models\ReadingItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ReadingControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_show_requires_authentication()
    {
        $level = Level::factory()->create(['code' => 'A1']);
        Day::factory()->create(['level_id' => $level->id, 'day_number' => 1]);

        $this->get(route('learn.lessons.reading', ['A1', 1]))->assertRedirect(route('login'));
    }

    public function test_shows_the_reading_item_including_article_url_for_a_reachable_day()
    {
        $user = User::factory()->create();
        $level = Level::factory()->create(['code' => 'A1', 'is_published' => true]);
        $day = Day::factory()->create(['level_id' => $level->id, 'day_number' => 1, 'is_published' => true]);
        ReadingItem::create([
            'day_id' => $day->id,
            'instruction' => 'Lies den Text.',
            'article_url' => 'https://example.com/article',
            'passage' => 'Hallo, wie geht es dir?',
            'question' => 'Was bedeutet das?',
        ]);

        $response = $this->actingAs($user)->get(route('learn.lessons.reading', ['A1', 1]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('learn/lessons/reading')
            ->where('readingItem.passage', 'Hallo, wie geht es dir?')
            ->where('readingItem.article_url', 'https://example.com/article'),
        );
    }

    public function test_redirects_to_the_roadmap_for_a_locked_day()
    {
        $user = User::factory()->create();
        $current = Level::factory()->create(['code' => 'A1', 'sort_order' => 1, 'is_published' => true]);
        Day::factory()->create(['level_id' => $current->id, 'day_number' => 1, 'is_published' => true]);
        $locked = Level::factory()->create(['code' => 'A2', 'sort_order' => 2, 'is_published' => true]);
        Day::factory()->create(['level_id' => $locked->id, 'day_number' => 1, 'is_published' => true]);

        $response = $this->actingAs($user)->get(route('learn.lessons.reading', ['A2', 1]));

        $response->assertRedirect(route('learn.lessons.roadmap', 'A2'));
    }
}
