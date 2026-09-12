<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property int $day_id
 * @property bool $wortschatz
 * @property bool $hoeren
 * @property bool $lesen
 * @property bool $sprechen
 * @property CarbonImmutable|null $completed_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Fillable(['user_id', 'day_id', 'wortschatz', 'hoeren', 'lesen', 'sprechen', 'completed_at'])]
class DayProgress extends Model
{
    protected function casts(): array
    {
        return [
            'wortschatz' => 'boolean',
            'hoeren' => 'boolean',
            'lesen' => 'boolean',
            'sprechen' => 'boolean',
            'completed_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Day, $this>
     */
    public function day(): BelongsTo
    {
        return $this->belongsTo(Day::class);
    }
}
