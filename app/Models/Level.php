<?php

namespace App\Models;

use Database\Factories\LevelFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $code
 * @property string $title
 * @property string|null $description
 * @property int $sort_order
 * @property bool $is_published
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read int|null $done_days Set by Api\LevelController@index for the authenticated user; not persisted.
 * @property-read string|null $status Set by Api\LevelController@index for the authenticated user; not persisted.
 * @property-read bool|null $enrolled Set by Api\LevelController@index for the authenticated user; not persisted.
 */
#[Fillable(['code', 'title', 'description', 'sort_order', 'is_published'])]
class Level extends Model
{
    /** @use HasFactory<LevelFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
        ];
    }

    /**
     * @return HasMany<Day, $this>
     */
    public function days(): HasMany
    {
        return $this->hasMany(Day::class)->orderBy('day_number');
    }

    /**
     * @return HasMany<Enrollment, $this>
     */
    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }
}
