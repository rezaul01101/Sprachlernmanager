<?php

namespace App\Models;

use Database\Factories\DayFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $level_id
 * @property int $day_number
 * @property string $focus_text
 * @property bool $is_published
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['level_id', 'day_number', 'focus_text', 'is_published'])]
class Day extends Model
{
    /** @use HasFactory<DayFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Level, $this>
     */
    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    /**
     * @return HasMany<VocabCard, $this>
     */
    public function vocabCards(): HasMany
    {
        return $this->hasMany(VocabCard::class)->orderBy('sort_order');
    }

    /**
     * @return HasOne<ListeningItem, $this>
     */
    public function listeningItem(): HasOne
    {
        return $this->hasOne(ListeningItem::class);
    }

    /**
     * @return HasOne<ReadingItem, $this>
     */
    public function readingItem(): HasOne
    {
        return $this->hasOne(ReadingItem::class);
    }

    /**
     * @return HasOne<SpeakingItem, $this>
     */
    public function speakingItem(): HasOne
    {
        return $this->hasOne(SpeakingItem::class);
    }

    /**
     * @return HasMany<DayProgress, $this>
     */
    public function progress(): HasMany
    {
        return $this->hasMany(DayProgress::class);
    }
}
