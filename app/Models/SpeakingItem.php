<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $day_id
 * @property array<int, array{german: string, english: string, pronounce: string|null}> $dialogue
 * @property array<int, array{german: string, english: string, pronounce: string|null}> $words
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Fillable(['day_id', 'dialogue', 'words'])]
class SpeakingItem extends Model
{
    /**
     * Rows created before this column existed (or any insert that omits
     * it) store NULL — always hand back [] rather than null so callers
     * never need a null-guard before mapping/counting dialogue lines.
     *
     * @return Attribute<array<int, array{german: string, english: string, pronounce: string|null}>, array<int, array{german: string, english: string, pronounce: string|null}>|null>
     */
    protected function dialogue(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value !== null ? json_decode($value, true) : [],
            set: fn (?array $value) => json_encode($value ?? []),
        );
    }

    /**
     * @return Attribute<array<int, array{german: string, english: string, pronounce: string|null}>, array<int, array{german: string, english: string, pronounce: string|null}>|null>
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
