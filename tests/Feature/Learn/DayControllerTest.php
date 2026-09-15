<?php

namespace Tests\Feature\Learn;

use App\Models\Day;
use App\Models\Level;
use App\Models\ListeningItem;
use App\Models\User;
use App\Models\VocabCard;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DayControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_show_requires_authentication()
    {
        $level = Level::factory()->create(['code' => 'A1']);
        Day::factory()->create(['level_id' => $level->id, 'day_number' => 1]);

        $response = $this->get(route('learn.lessons.day', ['A1', 1]));

        $response->assertRedirect(route('login'));
    }

    public function test_reachable_day_renders_with_progress_and_completion_summary()
    {
        $user = User::factory()->create();
        $level = Level::factory()->create(['code' => 'A1', 'is_published' => true]);
        $day = Day::factory()->create(['level_id' => $level->id, 'day_number' => 1, 'focus_text' => 'Begrüßungen', 'is_published' => true]);
        VocabCard::factory()->create(['day_id' => $day->id]);

        $response = $this->actingAs($user)->get(route('learn.lessons.day', ['A1', 1]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('learn/lessons/day')
            ->where('level.code', 'A1')
            ->where('day.focus_text', 'Begrüßungen')
            ->where('progress.wortschatz', false)
            ->where('completionSummary.requiredSkills', ['wortschatz'])
            ->where('completionSummary.isDayComplete', false),
        );
    }

    public function test_a_locked_day_redirects_to_the_roadmap_with_a_flash_toast()
    {
        $user = User::factory()->create();
        $current = Level::factory()->create(['code' => 'A1', 'sort_order' => 1, 'is_published' => true]);
        Day::factory()->create(['level_id' => $current->id, 'day_number' => 1, 'is_published' => true]);
        $locked = Level::factory()->create(['code' => 'A2', 'sort_order' => 2, 'is_published' => true]);
        Day::factory()->create(['level_id' => $locked->id, 'day_number' => 1, 'is_published' => true]);

        $response = $this->actingAs($user)->get(route('learn.lessons.day', ['A2', 1]));

        $response->assertRedirect(route('learn.lessons.roadmap', 'A2'));
        $response->assertInertiaFlash('toast');
    }

    public function test_an_unreached_day_further_ahead_redirects_to_the_roadmap()
    {
        $user = User::factory()->create();
        $level = Level::factory()->create(['code' => 'A1', 'is_published' => true]);
        Day::factory()->create(['level_id' => $level->id, 'day_number' => 1, 'is_published' => true]);
        Day::factory()->create(['level_id' => $level->id, 'day_number' => 2, 'is_published' => true]);

        // Day 1 is not yet completed, so day 2 should not be reachable.
        $response = $this->actingAs($user)->get(route('learn.lessons.day', ['A1', 2]));

        $response->assertRedirect(route('learn.lessons.roadmap', 'A1'));
    }

    public function test_completing_a_skill_redirects_back_to_the_day_and_persists_progress()
    {
        $user = User::factory()->create();
        $level = Level::factory()->create(['code' => 'A1', 'is_published' => true]);
        $day = Day::factory()->create(['level_id' => $level->id, 'day_number' => 1, 'is_published' => true]);
        VocabCard::factory()->create(['day_id' => $day->id]);
        ListeningItem::create(['day_id' => $day->id, 'type' => 'audio', 'title' => 'Hören', 'duration_label' => '2 min', 'question' => 'Was?']);

        $response = $this->actingAs($user)->post(route('learn.lessons.complete', ['A1', 1]), ['skill' => 'wortschatz']);

        $response->assertRedirect(route('learn.lessons.day', ['A1', 1]));
        $this->assertDatabaseHas('day_progress', ['user_id' => $user->id, 'day_id' => $day->id, 'wortschatz' => true, 'hoeren' => false]);

        $response = $this->actingAs($user)->get(route('learn.lessons.day', ['A1', 1]));
        $response->assertInertia(fn (Assert $page) => $page
            ->where('progress.wortschatz', true)
            ->where('completionSummary.isDayComplete', false),
        );
    }
}
