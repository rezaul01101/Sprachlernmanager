<?php

namespace Tests\Feature\Learn;

use App\Models\Day;
use App\Models\Level;
use App\Models\SpeakingItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SpeakingControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_show_requires_authentication()
    {
        $level = Level::factory()->create(['code' => 'A1']);
        Day::factory()->create(['level_id' => $level->id, 'day_number' => 1]);

        $this->get(route('learn.lessons.speaking', ['A1', 1]))->assertRedirect(route('login'));
    }

    public function test_shows_the_speaking_item_with_dialogue_and_words_for_a_reachable_day()
    {
        $user = User::factory()->create();
        $level = Level::factory()->create(['code' => 'A1', 'is_published' => true]);
        $day = Day::factory()->create(['level_id' => $level->id, 'day_number' => 1, 'is_published' => true]);
        SpeakingItem::create([
            'day_id' => $day->id,
            'dialogue' => [
                ['german' => 'Guten Tag!', 'english' => 'Good day!', 'pronounce' => 'গুটেন টাক!'],
                ['german' => 'Hallo!', 'english' => 'Hello!', 'pronounce' => 'হ্যালো!'],
            ],
            'words' => [
                ['german' => 'der Termin', 'english' => 'appointment', 'pronounce' => 'ডেয়া টারমিন'],
            ],
        ]);

        $response = $this->actingAs($user)->get(route('learn.lessons.speaking', ['A1', 1]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('learn/lessons/speaking')
            ->where('speakingItem.dialogue.0.german', 'Guten Tag!')
            ->where('speakingItem.dialogue.1.german', 'Hallo!')
            ->where('speakingItem.words.0.german', 'der Termin'),
        );
    }

    public function test_redirects_to_the_roadmap_for_a_locked_day()
    {
        $user = User::factory()->create();
        $current = Level::factory()->create(['code' => 'A1', 'sort_order' => 1, 'is_published' => true]);
        Day::factory()->create(['level_id' => $current->id, 'day_number' => 1, 'is_published' => true]);
        $locked = Level::factory()->create(['code' => 'A2', 'sort_order' => 2, 'is_published' => true]);
        Day::factory()->create(['level_id' => $locked->id, 'day_number' => 1, 'is_published' => true]);

        $response = $this->actingAs($user)->get(route('learn.lessons.speaking', ['A2', 1]));

        $response->assertRedirect(route('learn.lessons.roadmap', 'A2'));
    }
}
