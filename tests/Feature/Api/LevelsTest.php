<?php

namespace Tests\Feature\Api;

use App\Models\Day;
use App\Models\Level;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LevelsTest extends TestCase
{
    use RefreshDatabase;

    private function authHeader(): array
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        return ['Authorization' => "Bearer {$token}"];
    }

    public function test_levels_requires_authentication()
    {
        $response = $this->getJson('/api/v1/levels');

        $response->assertUnauthorized();
    }

    public function test_levels_only_returns_published_levels_with_published_day_counts()
    {
        $published = Level::factory()->create(['code' => 'A1', 'sort_order' => 1, 'is_published' => true]);
        Level::factory()->create(['code' => 'A2', 'sort_order' => 2, 'is_published' => false]);

        Day::factory()->create(['level_id' => $published->id, 'day_number' => 1, 'is_published' => true]);
        Day::factory()->create(['level_id' => $published->id, 'day_number' => 2, 'is_published' => false]);

        $response = $this->withHeaders($this->authHeader())->getJson('/api/v1/levels');

        $response->assertOk();
        $response->assertJsonCount(1);
        $response->assertJson([
            ['code' => 'A1', 'days' => 1],
        ]);
    }

    public function test_days_endpoint_returns_only_published_days_for_a_published_level()
    {
        $level = Level::factory()->create(['code' => 'B1', 'is_published' => true]);
        Day::factory()->create(['level_id' => $level->id, 'day_number' => 1, 'focus_text' => 'Erste Schritte', 'is_published' => true]);
        Day::factory()->create(['level_id' => $level->id, 'day_number' => 2, 'is_published' => false]);

        $response = $this->withHeaders($this->authHeader())->getJson('/api/v1/levels/B1/days');

        $response->assertOk();
        $response->assertJsonCount(1);
        $response->assertJson([
            ['day' => 1, 'focusText' => 'Erste Schritte'],
        ]);
    }

    public function test_days_endpoint_404s_for_an_unpublished_level()
    {
        Level::factory()->create(['code' => 'C1', 'is_published' => false]);

        $response = $this->withHeaders($this->authHeader())->getJson('/api/v1/levels/C1/days');

        $response->assertNotFound();
    }
}
