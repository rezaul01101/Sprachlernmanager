<?php

namespace App\Models;

use Database\Factories\GrammarFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $title
 * @property string|null $description Sanitised rich-text HTML.
 * @property string|null $image_path Path on the public disk.
 * @property-read string|null $image_url
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['title', 'description', 'image_path'])]
class Grammar extends Model
{
    /** @use HasFactory<GrammarFactory> */
    use HasFactory;

    /** @var list<string> */
    protected $appends = ['image_url'];

    /**
     * Absolute URL built from the current request host (not APP_URL), so the
     * mobile app gets a reachable address whichever host it calls the API on.
     *
     * @return Attribute<string|null, never>
     */
    protected function imageUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->image_path ? asset('storage/'.$this->image_path) : null);
    }
}
