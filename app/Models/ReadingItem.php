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
 * @property string $instruction
 * @property string $passage
 * @property string $question
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Fillable(['day_id', 'instruction', 'passage', 'question'])]
class ReadingItem extends Model
{
    /**
     * @return BelongsTo<Day, $this>
     */
    public function day(): BelongsTo
    {
        return $this->belongsTo(Day::class);
    }

    /**
     * @return HasMany<ReadingOption, $this>
     */
    public function options(): HasMany
    {
        return $this->hasMany(ReadingOption::class)->orderBy('sort_order');
    }
}
