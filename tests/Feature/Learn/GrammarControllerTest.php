<?php

namespace Tests\Feature\Learn;

use App\Models\Grammar;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class GrammarControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login()
    {
        $grammar = Grammar::factory()->create();

        $this->get(route('learn.grammar.index'))->assertRedirect(route('login'));
        $this->get(route('learn.grammar.show', $grammar))->assertRedirect(route('login'));
    }

    public function test_index_lists_grammars_with_title_and_image_url()
    {
        $user = User::factory()->create();
        Grammar::factory()->create(['title' => 'Dativ', 'image_path' => 'grammars/dativ.png']);
        Grammar::factory()->create(['title' => 'Akkusativ', 'image_path' => null]);

        $this->actingAs($user)->get(route('learn.grammar.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('learn/grammar/index')
                ->has('grammars', 2)
                ->where('grammars.0.title', 'Akkusativ')
                ->where('grammars.0.image_url', null)
                ->where('grammars.1.image_url', asset('storage/grammars/dativ.png')));
    }

    public function test_show_returns_the_grammar_details()
    {
        $user = User::factory()->create();
        $grammar = Grammar::factory()->create(['title' => 'Genitiv', 'description' => '<p>Des Mannes</p>']);

        $this->actingAs($user)->get(route('learn.grammar.show', $grammar))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('learn/grammar/show')
                ->where('grammar.title', 'Genitiv')
                ->where('grammar.description', '<p>Des Mannes</p>'));
    }
}
