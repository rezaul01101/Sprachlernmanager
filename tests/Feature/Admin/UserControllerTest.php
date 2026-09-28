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

    public function test_admin_can_change_a_users_password()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $learner = User::factory()->create();
        $originalPassword = $learner->password;

        $response = $this->actingAs($admin)->put(route('admin.users.update-password', $learner), [
            'password' => 'new-secret-password',
            'password_confirmation' => 'new-secret-password',
        ]);

        $response->assertRedirect();
        $this->assertNotSame($originalPassword, $learner->fresh()->password);
    }

    public function test_changing_a_users_password_requires_confirmation()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $learner = User::factory()->create();

        $response = $this->actingAs($admin)->put(route('admin.users.update-password', $learner), [
            'password' => 'new-secret-password',
            'password_confirmation' => 'does-not-match',
        ]);

        $response->assertSessionHasErrors('password');
    }

    public function test_non_admin_cannot_change_a_users_password()
    {
        $user = User::factory()->create(['is_admin' => false]);
        $learner = User::factory()->create();

        $response = $this->actingAs($user)->put(route('admin.users.update-password', $learner), [
            'password' => 'new-secret-password',
            'password_confirmation' => 'new-secret-password',
        ]);

        $response->assertForbidden();
    }
}
