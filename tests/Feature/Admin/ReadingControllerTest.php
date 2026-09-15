<?php

namespace Tests\Feature\Admin;

use App\Models\Day;
use App\Models\Level;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReadingControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_save_a_reading_item_with_an_article_link()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);

        $response = $this->actingAs($admin)->put(route('admin.levels.reading.update', [$level, $day]), [
            'instruction' => 'Lesen Sie den Text und lernen Sie die markierten Wörter.',
            'article_url' => 'https://example.com/article',
            'passage' => 'Frau Keller wohnt seit drei Monaten in Berlin.',
            'words' => [
                ['word' => 'der Wohnsitz', 'pronounce' => 'dehr VOHN-zits', 'meaning' => 'residence'],
            ],
        ]);

        $response->assertRedirect(route('admin.levels.reading.edit', [$level, $day]));
        $this->assertDatabaseHas('reading_items', [
            'day_id' => $day->id,
            'article_url' => 'https://example.com/article',
            'words' => json_encode([
                ['word' => 'der Wohnsitz', 'pronounce' => 'dehr VOHN-zits', 'meaning' => 'residence'],
            ]),
        ]);
    }

    public function test_article_link_is_optional()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);

        $response = $this->actingAs($admin)->put(route('admin.levels.reading.update', [$level, $day]), [
            'instruction' => 'Lesen Sie den Text und lernen Sie die markierten Wörter.',
            'passage' => 'Frau Keller wohnt seit drei Monaten in Berlin.',
            'words' => [],
        ]);

        $response->assertRedirect(route('admin.levels.reading.edit', [$level, $day]));
        $this->assertDatabaseHas('reading_items', [
            'day_id' => $day->id,
            'article_url' => null,
        ]);
    }

    public function test_article_link_must_be_a_valid_url()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);

        $response = $this->actingAs($admin)->put(route('admin.levels.reading.update', [$level, $day]), [
            'instruction' => 'Lesen Sie den Text und lernen Sie die markierten Wörter.',
            'article_url' => 'not-a-url',
            'passage' => 'Frau Keller wohnt seit drei Monaten in Berlin.',
            'words' => [],
        ]);

        $response->assertSessionHasErrors('article_url');
    }

    public function test_words_are_optional_per_entry()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);

        $response = $this->actingAs($admin)->put(route('admin.levels.reading.update', [$level, $day]), [
            'instruction' => 'Lesen Sie den Text und lernen Sie die markierten Wörter.',
            'passage' => 'Frau Keller wohnt seit drei Monaten in Berlin.',
            'words' => [
                ['word' => 'der Termin'],
            ],
        ]);

        $response->assertRedirect(route('admin.levels.reading.edit', [$level, $day]));
        $this->assertDatabaseHas('reading_items', [
            'day_id' => $day->id,
            'words' => json_encode([
                ['word' => 'der Termin', 'pronounce' => null, 'meaning' => null],
            ]),
        ]);
    }
}
