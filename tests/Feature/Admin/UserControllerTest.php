<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_view_users_index()
    {
        $user = User::factory()->create(['is_admin' => false]);

        $response = $this->actingAs($user)->get(route('admin.users.index'));

        $response->assertForbidden();
    }

    public function test_admin_can_view_users_index()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        User::factory()->count(3)->create();

        $response = $this->actingAs($admin)->get(route('admin.users.index'));

        $response->assertOk();
    }

    public function test_admin_can_view_a_users_detail_page()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $learner = User::factory()->create();

        $response = $this->actingAs($admin)->get(route('admin.users.show', $learner));

        $response->assertOk();
    }

    public function test_admin_can_revoke_a_users_tokens()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $learner = User::factory()->create();
        $learner->createToken('mobile');
        $learner->createToken('mobile-2');

        $response = $this->actingAs($admin)->post(route('admin.users.revoke-tokens', $learner));

        $response->assertRedirect();
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
