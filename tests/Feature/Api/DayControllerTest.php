<?php

namespace Tests\Feature\Api;

use App\Models\Day;
use App\Models\DayProgress;
use App\Models\Level;
use App\Models\ListeningItem;
use App\Models\User;
use App\Models\VocabCard;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DayControllerTest extends TestCase
{
    use RefreshDatabase;

    private function authHeaderFor(User $user): array
    {
        $token = $user->createToken('test')->plainTextToken;

        return ['Authorization' => "Bearer {$token}"];
    }

    private function authHeader(): array
    {
        return $this->authHeaderFor(User::factory()->create());
    }

    public function test_show_requires_authentication()
    {
        $level = Level::factory()->create(['code' => 'A1']);
        Day::factory()->create(['level_id' => $level->id, 'day_number' => 1]);

        $response = $this->getJson('/api/v1/levels/A1/days/1');

        $response->assertUnauthorized();
    }

    public function test_show_404s_for_unpublished_level_or_day()
    {
        $unpublishedLevel = Level::factory()->create(['code' => 'A1', 'is_published' => false]);
        Day::factory()->create(['level_id' => $unpublishedLevel->id, 'day_number' => 1, 'is_published' => true]);

        $response = $this->withHeaders($this->authHeader())->getJson('/api/v1/levels/A1/days/1');
        $response->assertNotFound();

        $publishedLevel = Level::factory()->create(['code' => 'A2', 'is_published' => true]);
        Day::factory()->create(['level_id' => $publishedLevel->id, 'day_number' => 1, 'is_published' => false]);

        $response = $this->withHeaders($this->authHeader())->getJson('/api/v1/levels/A2/days/1');
        $response->assertNotFound();
    }

    public function test_show_returns_day_detail_with_progress_and_null_skill_blocks_when_absent()
    {
        $level = Level::factory()->create(['code' => 'A1', 'is_published' => true]);
        $day = Day::factory()->create(['level_id' => $level->id, 'day_number' => 1, 'focus_text' => 'Begrüßungen', 'is_published' => true]);
        VocabCard::factory()->create(['day_id' => $day->id, 'word' => 'Hallo']);

        $response = $this->withHeaders($this->authHeader())->getJson('/api/v1/levels/A1/days/1');

        $response->assertOk();
        $response->assertJson([
            'day' => 1,
            'focusText' => 'Begrüßungen',
            'progress' => ['wortschatz' => false, 'hoeren' => false, 'lesen' => false, 'sprechen' => false],
            'listening' => [],
            'reading' => null,
            'speaking' => null,
        ]);
        $response->assertJsonCount(1, 'vocab');
    }

    public function test_show_reflects_existing_progress_for_the_authenticated_user_only()
    {
        $level = Level::factory()->create(['code' => 'A1', 'is_published' => true]);
        $day = Day::factory()->create(['level_id' => $level->id, 'day_number' => 1, 'is_published' => true]);

        $me = User::factory()->create();
        $someoneElse = User::factory()->create();
        DayProgress::create(['user_id' => $me->id, 'day_id' => $day->id, 'wortschatz' => true]);
        DayProgress::create(['user_id' => $someoneElse->id, 'day_id' => $day->id, 'wortschatz' => true, 'hoeren' => true]);

        $response = $this->withHeaders($this->authHeaderFor($me))->getJson('/api/v1/levels/A1/days/1');

        $response->assertJson([
            'progress' => ['wortschatz' => true, 'hoeren' => false, 'lesen' => false, 'sprechen' => false],
        ]);
    }

    public function test_complete_skill_validates_skill_value()
    {
        $level = Level::factory()->create(['code' => 'A1', 'is_published' => true]);
        Day::factory()->create(['level_id' => $level->id, 'day_number' => 1, 'is_published' => true]);

        $response = $this->withHeaders($this->authHeader())
            ->postJson('/api/v1/levels/A1/days/1/complete', ['skill' => 'not-a-skill']);

        $response->assertUnprocessable();
    }

    public function test_complete_skill_marks_the_skill_done_and_completes_the_day_once_all_present_skills_are_done()
    {
        $user = User::factory()->create();
        $headers = $this->authHeaderFor($user);

        $level = Level::factory()->create(['code' => 'A1', 'is_published' => true]);
        $day = Day::factory()->create(['level_id' => $level->id, 'day_number' => 1, 'is_published' => true]);
        VocabCard::factory()->create(['day_id' => $day->id]);
        ListeningItem::create(['day_id' => $day->id, 'type' => 'audio', 'title' => 'Hören', 'duration_label' => '2 min']);

        $response = $this->withHeaders($headers)
            ->postJson('/api/v1/levels/A1/days/1/complete', ['skill' => 'wortschatz']);

        $response->assertOk();
        $response->assertJson([
            'progress' => ['wortschatz' => true, 'hoeren' => false, 'lesen' => false, 'sprechen' => false],
            'dayCompleted' => false,
        ]);

        $response = $this->withHeaders($headers)
            ->postJson('/api/v1/levels/A1/days/1/complete', ['skill' => 'hoeren']);

        $response->assertOk();
        $response->assertJson([
            'progress' => ['wortschatz' => true, 'hoeren' => true, 'lesen' => false, 'sprechen' => false],
            'dayCompleted' => true,
        ]);

        $this->assertNotNull(DayProgress::where('user_id', $user->id)->where('day_id', $day->id)->first()->completed_at);
    }

    public function test_complete_skill_never_completes_a_day_with_no_content_at_all()
    {
        $level = Level::factory()->create(['code' => 'A1', 'is_published' => true]);
        Day::factory()->create(['level_id' => $level->id, 'day_number' => 1, 'is_published' => true]);

        $response = $this->withHeaders($this->authHeader())
            ->postJson('/api/v1/levels/A1/days/1/complete', ['skill' => 'wortschatz']);

        $response->assertOk();
        $response->assertJson(['dayCompleted' => false]);
    }
}
