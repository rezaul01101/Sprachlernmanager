<?php

namespace Tests\Feature\Admin;

use App\Models\Level;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LevelControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_access_admin_levels()
    {
        $user = User::factory()->create(['is_admin' => false]);

        $response = $this->actingAs($user)->get(route('admin.levels.index'));

        $response->assertForbidden();
    }

    public function test_guest_is_redirected_to_login()
    {
        $response = $this->get(route('admin.levels.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_admin_can_view_levels_index()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        Level::factory()->count(2)->create();

        $response = $this->actingAs($admin)->get(route('admin.levels.index'));

        $response->assertOk();
    }

    public function test_admin_can_create_a_level()
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->post(route('admin.levels.store'), [
            'code' => 'A1',
            'title' => 'Grundlagen',
            'description' => 'Beginner level',
            'sort_order' => 1,
            'is_published' => '1',
        ]);

        $response->assertRedirect(route('admin.levels.index'));
        $this->assertDatabaseHas('levels', ['code' => 'A1', 'title' => 'Grundlagen', 'is_published' => true]);
    }

    public function test_creating_a_level_requires_a_unique_code()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        Level::factory()->create(['code' => 'A1', 'sort_order' => 1]);

        $response = $this->actingAs($admin)->post(route('admin.levels.store'), [
            'code' => 'A1',
            'title' => 'Duplicate',
            'sort_order' => 2,
        ]);

        $response->assertSessionHasErrors('code');
    }

    public function test_admin_can_update_a_level_and_unpublish_it()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create(['is_published' => true]);

        $response = $this->actingAs($admin)->put(route('admin.levels.update', $level), [
            'code' => $level->code,
            'title' => 'Updated title',
            'sort_order' => $level->sort_order,
        ]);

        $response->assertRedirect(route('admin.levels.index'));
        $this->assertDatabaseHas('levels', ['id' => $level->id, 'title' => 'Updated title', 'is_published' => false]);
    }

    public function test_admin_can_delete_a_level()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $level = Level::factory()->create();

        $response = $this->actingAs($admin)->delete(route('admin.levels.destroy', $level));

        $response->assertRedirect(route('admin.levels.index'));
        $this->assertDatabaseMissing('levels', ['id' => $level->id]);
    }

    public function test_admin_can_reorder_levels()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $first = Level::factory()->create(['sort_order' => 1]);
        $second = Level::factory()->create(['sort_order' => 2]);

        $response = $this->actingAs($admin)->post(route('admin.levels.reorder'), [
            'ids' => [$second->id, $first->id],
        ]);

        $response->assertRedirect();
        $this->assertSame(1, $second->fresh()->sort_order);
        $this->assertSame(2, $first->fresh()->sort_order);
    }
}
