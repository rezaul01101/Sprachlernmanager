<?php

namespace Tests\Feature\Admin;

use App\Models\Grammar;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class GrammarControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_access_grammar()
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)->get(route('admin.grammars.index'))->assertForbidden();
    }

    public function test_guest_is_redirected_to_login()
    {
        $this->get(route('admin.grammars.index'))->assertRedirect(route('login'));
    }

    public function test_admin_can_view_index_create_and_edit()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $grammar = Grammar::factory()->create();

        $this->actingAs($admin)->get(route('admin.grammars.index'))->assertOk();
        $this->actingAs($admin)->get(route('admin.grammars.create'))->assertOk();
        $this->actingAs($admin)->get(route('admin.grammars.edit', $grammar))->assertOk();
    }

    public function test_admin_can_create_a_grammar()
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)->post(route('admin.grammars.store'), [
            'title' => 'Akkusativ',
            'description' => '<p>Use <strong>den</strong> for masculine nouns.</p>',
        ])->assertRedirect(route('admin.grammars.index'));

        $this->assertDatabaseHas('grammars', [
            'title' => 'Akkusativ',
            'description' => '<p>Use <strong>den</strong> for masculine nouns.</p>',
        ]);
    }

    public function test_title_is_required()
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)->post(route('admin.grammars.store'), ['title' => ''])
            ->assertSessionHasErrors('title');
    }

    public function test_description_is_sanitised()
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)->post(route('admin.grammars.store'), [
            'title' => 'Dativ',
            'description' => '<p onclick="x()">Hi<script>alert(1)</script></p><img src=x onerror=y>',
        ]);

        $this->assertDatabaseHas('grammars', [
            'title' => 'Dativ',
            'description' => '<p>Hialert(1)</p>',
        ]);
    }

    public function test_empty_editor_content_is_stored_as_null()
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)->post(route('admin.grammars.store'), [
            'title' => 'Genitiv',
            'description' => '<p></p>',
        ]);

        $this->assertDatabaseHas('grammars', ['title' => 'Genitiv', 'description' => null]);
    }

    public function test_admin_can_update_a_grammar()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $grammar = Grammar::factory()->create();

        $this->actingAs($admin)->put(route('admin.grammars.update', $grammar), [
            'title' => 'Updated',
            'description' => '<ul><li>One</li></ul>',
        ])->assertRedirect(route('admin.grammars.index'));

        $this->assertDatabaseHas('grammars', [
            'id' => $grammar->id,
            'title' => 'Updated',
            'description' => '<ul><li>One</li></ul>',
        ]);
    }

    public function test_admin_can_delete_a_grammar()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $grammar = Grammar::factory()->create();

        $this->actingAs($admin)->delete(route('admin.grammars.destroy', $grammar))
            ->assertRedirect(route('admin.grammars.index'));

        $this->assertModelMissing($grammar);
    }

    public function test_admin_can_upload_replace_and_remove_an_image()
    {
        Storage::fake('public');
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)->post(route('admin.grammars.store'), [
            'title' => 'Artikel',
            'image' => UploadedFile::fake()->image('a.png'),
        ])->assertSessionHasNoErrors();

        $grammar = Grammar::where('title', 'Artikel')->firstOrFail();
        Storage::disk('public')->assertExists($grammar->image_path);
        $first = $grammar->image_path;

        $this->actingAs($admin)->put(route('admin.grammars.update', $grammar), [
            'title' => 'Artikel',
            'image' => UploadedFile::fake()->image('b.jpg'),
        ]);
        $grammar->refresh();
        Storage::disk('public')->assertMissing($first);
        Storage::disk('public')->assertExists($grammar->image_path);
        $second = $grammar->image_path;

        $this->actingAs($admin)->put(route('admin.grammars.update', $grammar), [
            'title' => 'Artikel',
            'remove_image' => '1',
        ]);
        Storage::disk('public')->assertMissing($second);
        $this->assertNull($grammar->refresh()->image_path);
    }

    public function test_non_image_upload_is_rejected()
    {
        Storage::fake('public');
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)->post(route('admin.grammars.store'), [
            'title' => 'Bad',
            'image' => UploadedFile::fake()->create('x.pdf', 10, 'application/pdf'),
        ])->assertSessionHasErrors('image');
    }

    public function test_deleting_a_grammar_removes_its_image()
    {
        Storage::fake('public');
        Storage::disk('public')->put('grammars/x.png', 'x');
        $admin = User::factory()->create(['is_admin' => true]);
        $grammar = Grammar::factory()->create(['image_path' => 'grammars/x.png']);

        $this->actingAs($admin)->delete(route('admin.grammars.destroy', $grammar));

        Storage::disk('public')->assertMissing('grammars/x.png');
    }
}
