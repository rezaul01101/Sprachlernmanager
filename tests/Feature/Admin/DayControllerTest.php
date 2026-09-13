<?php

namespace Tests\Feature\Admin;

use App\Models\Day;
use App\Models\Level;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DayControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_a_day()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();

        $response = $this->actingAs($admin)->post(route('admin.levels.days.store', $level), [
            'day_number' => 1,
            'focus_text' => 'Begrüßungen',
            'is_published' => '1',
        ]);

        $response->assertRedirect(route('admin.levels.days.index', $level));
        $this->assertDatabaseHas('days', ['level_id' => $level->id, 'day_number' => 1, 'is_published' => true]);
    }

    public function test_day_number_must_be_unique_within_a_level()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        Day::factory()->create(['level_id' => $level->id, 'day_number' => 1]);

        $response = $this->actingAs($admin)->post(route('admin.levels.days.store', $level), [
            'day_number' => 1,
            'focus_text' => 'Duplicate',
        ]);

        $response->assertSessionHasErrors('day_number');
    }

    public function test_same_day_number_is_allowed_across_different_levels()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $levelA = Level::factory()->create();
        $levelB = Level::factory()->create();
        Day::factory()->create(['level_id' => $levelA->id, 'day_number' => 1]);

        $response = $this->actingAs($admin)->post(route('admin.levels.days.store', $levelB), [
            'day_number' => 1,
            'focus_text' => 'Also day one',
        ]);

        $response->assertRedirect(route('admin.levels.days.index', $levelB));
        $this->assertDatabaseHas('days', ['level_id' => $levelB->id, 'day_number' => 1]);
    }

    public function test_a_day_from_another_level_returns_404()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $levelA = Level::factory()->create();
        $levelB = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $levelA->id]);

        $response = $this->actingAs($admin)->get(route('admin.levels.days.edit', [$levelB, $day]));

        $response->assertNotFound();
    }

    public function test_admin_can_view_a_days_show_page()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);

        $response = $this->actingAs($admin)->get(route('admin.levels.days.show', [$level, $day]));

        $response->assertOk();
    }

    public function test_a_days_show_page_for_a_day_from_another_level_returns_404()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $levelA = Level::factory()->create();
        $levelB = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $levelA->id]);

        $response = $this->actingAs($admin)->get(route('admin.levels.days.show', [$levelB, $day]));

        $response->assertNotFound();
    }

    public function test_admin_can_delete_a_day()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();
        $day = Day::factory()->create(['level_id' => $level->id]);

        $response = $this->actingAs($admin)->delete(route('admin.levels.days.destroy', [$level, $day]));

        $response->assertRedirect(route('admin.levels.days.index', $level));
        $this->assertDatabaseMissing('days', ['id' => $day->id]);
    }
}
