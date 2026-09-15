<?php

namespace Tests\Feature\Learn;

use App\Models\Day;
use App\Models\Level;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LevelControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_lessons_index_requires_authentication()
    {
        $response = $this->get(route('learn.lessons.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_lessons_index_shows_published_levels_with_computed_status()
    {
        $user = User::factory()->create();
        Level::factory()->create(['code' => 'A1', 'sort_order' => 1, 'is_published' => true]);
        Level::factory()->create(['code' => 'A2', 'sort_order' => 2, 'is_published' => true]);
        Level::factory()->create(['code' => 'X1', 'sort_order' => 3, 'is_published' => false]);

        $response = $this->actingAs($user)->get(route('learn.lessons.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('learn/lessons/index')
            ->has('levels', 2)
            ->where('levels.0.code', 'A1')
            ->where('levels.0.status', 'current')
            ->where('levels.1.status', 'locked'),
        );
    }

    public function test_roadmap_404s_for_an_unpublished_or_nonexistent_level_code()
    {
        $user = User::factory()->create();
        Level::factory()->create(['code' => 'A1', 'is_published' => false]);

        $this->actingAs($user)->get(route('learn.lessons.roadmap', 'A1'))->assertNotFound();
        $this->actingAs($user)->get(route('learn.lessons.roadmap', 'ZZ'))->assertNotFound();
    }

    public function test_visiting_a_reachable_roadmap_auto_enrolls_the_user()
    {
        $user = User::factory()->create();
        $level = Level::factory()->create(['code' => 'A1', 'sort_order' => 1, 'is_published' => true]);
        Day::factory()->create(['level_id' => $level->id, 'day_number' => 1, 'is_published' => true]);

        $this->assertDatabaseMissing('enrollments', ['user_id' => $user->id, 'level_id' => $level->id]);

        $response = $this->actingAs($user)->get(route('learn.lessons.roadmap', 'A1'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('learn/lessons/roadmap')
            ->where('level.enrolled', true),
        );
        $this->assertDatabaseHas('enrollments', ['user_id' => $user->id, 'level_id' => $level->id]);
    }

    public function test_visiting_a_locked_roadmap_does_not_enroll_the_user()
    {
        $user = User::factory()->create();
        $current = Level::factory()->create(['code' => 'A1', 'sort_order' => 1, 'is_published' => true]);
        Day::factory()->create(['level_id' => $current->id, 'day_number' => 1, 'is_published' => true]);
        $locked = Level::factory()->create(['code' => 'A2', 'sort_order' => 2, 'is_published' => true]);
        Day::factory()->create(['level_id' => $locked->id, 'day_number' => 1, 'is_published' => true]);

        $response = $this->actingAs($user)->get(route('learn.lessons.roadmap', 'A2'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->where('level.status', 'locked')
            ->where('level.enrolled', false),
        );
        $this->assertDatabaseMissing('enrollments', ['user_id' => $user->id, 'level_id' => $locked->id]);
    }
}
