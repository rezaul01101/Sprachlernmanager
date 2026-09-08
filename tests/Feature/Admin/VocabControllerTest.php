<?php

namespace Tests\Feature\Admin;

use App\Models\Day;
use App\Models\Level;
use App\Models\User;
use App\Models\VocabCard;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VocabControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_the_vocab_day_grid_for_a_level()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        Day::factory()->count(3)->create(['level_id' => $level->id]);

        $response = $this->actingAs($admin)->get(route('admin.levels.vocab.index', $level));

        $response->assertOk();
    }

    public function test_admin_can_view_a_days_existing_vocab_cards()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);
        VocabCard::factory()->create(['day_id' => $day->id, 'word' => 'der Ausweis']);

        $response = $this->actingAs($admin)->get(route('admin.levels.vocab.edit', [$level, $day]));

        $response->assertOk();
    }

    public function test_saving_vocab_replaces_the_days_existing_cards()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);
        VocabCard::factory()->create(['day_id' => $day->id, 'word' => 'old-word']);

        $response = $this->actingAs($admin)->put(route('admin.levels.vocab.update', [$level, $day]), [
            'cards' => [
                [
                    'word' => 'der Ausweis',
                    'tag' => 'Substantiv · m.',
                    'translation_en' => 'ID card',
                    'translation_bn' => 'আইডি কার্ড',
                    'example' => 'Bitte zeigen Sie Ihren Ausweis.',
                ],
                [
                    'word' => 'anmelden',
                    'translation_en' => 'to register',
                ],
            ],
        ]);

        $response->assertRedirect(route('admin.levels.vocab.edit', [$level, $day]));
        $this->assertDatabaseMissing('vocab_cards', ['word' => 'old-word']);
        $this->assertDatabaseHas('vocab_cards', [
            'day_id' => $day->id,
            'word' => 'der Ausweis',
            'translation_en' => 'ID card',
            'translation_bn' => 'আইডি কার্ড',
            'sort_order' => 1,
        ]);
        $this->assertDatabaseHas('vocab_cards', [
            'day_id' => $day->id,
            'word' => 'anmelden',
            'tag' => null,
            'sort_order' => 2,
        ]);
    }

    public function test_saving_vocab_requires_word_and_translation_en()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);

        $response = $this->actingAs($admin)->put(route('admin.levels.vocab.update', [$level, $day]), [
            'cards' => [
                ['word' => '', 'translation_en' => ''],
            ],
        ]);

        $response->assertSessionHasErrors(['cards.0.word', 'cards.0.translation_en']);
    }

    public function test_saving_an_empty_cards_array_clears_the_days_vocab()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);
        VocabCard::factory()->create(['day_id' => $day->id]);

        $response = $this->actingAs($admin)->put(route('admin.levels.vocab.update', [$level, $day]), [
            'cards' => [],
        ]);

        $response->assertRedirect(route('admin.levels.vocab.edit', [$level, $day]));
        $this->assertDatabaseCount('vocab_cards', 0);
    }
}
