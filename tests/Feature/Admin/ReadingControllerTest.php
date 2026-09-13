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
            'instruction' => 'Lesen Sie den Text und beantworten Sie die Frage.',
            'article_url' => 'https://example.com/article',
            'passage' => 'Frau Keller wohnt seit drei Monaten in Berlin.',
            'question' => 'Warum geht Frau Keller zum Bürgeramt?',
            'options' => [
                ['text' => 'Um ihren Wohnsitz anzumelden', 'is_correct' => true, 'explanation' => null],
            ],
        ]);

        $response->assertRedirect(route('admin.levels.reading.edit', [$level, $day]));
        $this->assertDatabaseHas('reading_items', [
            'day_id' => $day->id,
            'article_url' => 'https://example.com/article',
        ]);
    }

    public function test_article_link_is_optional()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);

        $response = $this->actingAs($admin)->put(route('admin.levels.reading.update', [$level, $day]), [
            'instruction' => 'Lesen Sie den Text und beantworten Sie die Frage.',
            'passage' => 'Frau Keller wohnt seit drei Monaten in Berlin.',
            'question' => 'Warum geht Frau Keller zum Bürgeramt?',
            'options' => [
                ['text' => 'Um ihren Wohnsitz anzumelden', 'is_correct' => true],
            ],
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
            'instruction' => 'Lesen Sie den Text und beantworten Sie die Frage.',
            'article_url' => 'not-a-url',
            'passage' => 'Frau Keller wohnt seit drei Monaten in Berlin.',
            'question' => 'Warum geht Frau Keller zum Bürgeramt?',
            'options' => [
                ['text' => 'Um ihren Wohnsitz anzumelden', 'is_correct' => true],
            ],
        ]);

        $response->assertSessionHasErrors('article_url');
    }
}
