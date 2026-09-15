<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\ListeningItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $day_id
 * @property string $type
 * @property string|null $video_url
 * @property string|null $script
 * @property string $title
 * @property string $duration_label
 * @property array<int, array{word: string, pronounce: string|null, meaning: string|null}> $words
 * @property int $sort_order
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Fillable(['day_id', 'type', 'video_url', 'script', 'title', 'duration_label', 'words', 'sort_order'])]
class ListeningItem extends Model
{
    /** @use HasFactory<ListeningItemFactory> */
    use HasFactory;

    /**
     * Rows created before this column existed (or any insert that omits
     * it) store NULL — always hand back [] rather than null so callers
     * never need a null-guard before mapping/counting related words.
     *
     * @return Attribute<array<int, array{word: string, pronounce: string|null, meaning: string|null}>, array<int, array{word: string, pronounce: string|null, meaning: string|null}>|null>
     */
    protected function words(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value !== null ? json_decode($value, true) : [],
            set: fn (?array $value) => json_encode($value ?? []),
        );
    }

    /**
     * @return BelongsTo<Day, $this>
     */
    public function day(): BelongsTo
    {
        return $this->belongsTo(Day::class);
    }
}
