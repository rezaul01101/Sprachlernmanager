<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $day_id
 * @property string $target_sentence
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Fillable(['day_id', 'target_sentence'])]
class SpeakingItem extends Model
{
    /**
     * @return BelongsTo<Day, $this>
     */
    public function day(): BelongsTo
    {
        return $this->belongsTo(Day::class);
    }

    /**
     * @return HasMany<SpeakingAiLine, $this>
     */
    public function aiLines(): HasMany
    {
        return $this->hasMany(SpeakingAiLine::class)->orderBy('sort_order');
    }
}
