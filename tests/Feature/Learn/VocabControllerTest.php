<?php

namespace Tests\Feature\Learn;

use App\Models\Day;
use App\Models\Level;
use App\Models\User;
use App\Models\VocabCard;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class VocabControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_show_requires_authentication()
    {
        $level = Level::factory()->create(['code' => 'A1']);
        Day::factory()->create(['level_id' => $level->id, 'day_number' => 1]);

        $this->get(route('learn.lessons.vocab', ['A1', 1]))->assertRedirect(route('login'));
    }

    public function test_shows_the_vocab_cards_for_a_reachable_day()
    {
        $user = User::factory()->create();
        $level = Level::factory()->create(['code' => 'A1', 'is_published' => true]);
        $day = Day::factory()->create(['level_id' => $level->id, 'day_number' => 1, 'is_published' => true]);
        VocabCard::factory()->create(['day_id' => $day->id, 'word' => 'Hallo']);

        $response = $this->actingAs($user)->get(route('learn.lessons.vocab', ['A1', 1]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('learn/lessons/vocab')
            ->has('vocabCards', 1)
            ->where('vocabCards.0.word', 'Hallo'),
        );
    }

    public function test_redirects_to_the_roadmap_for_a_locked_day()
    {
        $user = User::factory()->create();
        $current = Level::factory()->create(['code' => 'A1', 'sort_order' => 1, 'is_published' => true]);
        Day::factory()->create(['level_id' => $current->id, 'day_number' => 1, 'is_published' => true]);
        $locked = Level::factory()->create(['code' => 'A2', 'sort_order' => 2, 'is_published' => true]);
        Day::factory()->create(['level_id' => $locked->id, 'day_number' => 1, 'is_published' => true]);

        $response = $this->actingAs($user)->get(route('learn.lessons.vocab', ['A2', 1]));

        $response->assertRedirect(route('learn.lessons.roadmap', 'A2'));
    }
}
