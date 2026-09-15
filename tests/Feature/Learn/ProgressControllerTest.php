<?php

namespace Tests\Feature\Learn;

use App\Models\Level;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProgressControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_requires_authentication()
    {
        $this->get(route('learn.progress'))->assertRedirect(route('login'));
    }

    public function test_index_shows_published_levels_with_computed_status()
    {
        $user = User::factory()->create();
        Level::factory()->create(['code' => 'A1', 'sort_order' => 1, 'is_published' => true]);

        $response = $this->actingAs($user)->get(route('learn.progress'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('learn/progress/index')
            ->has('levels', 1)
            ->where('levels.0.code', 'A1'),
        );
    }
}
