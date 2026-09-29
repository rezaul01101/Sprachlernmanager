<?php

namespace Tests\Feature\Api;

use App\Models\Grammar;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GrammarTest extends TestCase
{
    use RefreshDatabase;

    private function authHeader(): array
    {
        $token = User::factory()->create()->createToken('test')->plainTextToken;

        return ['Authorization' => "Bearer {$token}"];
    }

    public function test_requires_authentication()
    {
        $grammar = Grammar::factory()->create();

        $this->getJson('/api/v1/grammars')->assertUnauthorized();
        $this->getJson("/api/v1/grammars/{$grammar->id}")->assertUnauthorized();
    }

    public function test_index_returns_id_title_and_image_url_without_description()
    {
        Grammar::factory()->create(['title' => 'Dativ', 'image_path' => 'grammars/dativ.png']);

        $this->withHeaders($this->authHeader())->getJson('/api/v1/grammars')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.title', 'Dativ')
            ->assertJsonPath('0.imageUrl', asset('storage/grammars/dativ.png'))
            ->assertJsonMissingPath('0.description');
    }

    public function test_show_returns_the_description()
    {
        $grammar = Grammar::factory()->create(['description' => '<p>Hallo</p>', 'image_path' => null]);

        $this->withHeaders($this->authHeader())->getJson("/api/v1/grammars/{$grammar->id}")
            ->assertOk()
            ->assertJsonPath('description', '<p>Hallo</p>')
            ->assertJsonPath('imageUrl', null);
    }
}
