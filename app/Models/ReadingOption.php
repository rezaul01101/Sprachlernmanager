<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $reading_item_id
 * @property string $text
 * @property bool $is_correct
 * @property string|null $explanation
 * @property int $sort_order
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Fillable(['reading_item_id', 'text', 'is_correct', 'explanation', 'sort_order'])]
class ReadingOption extends Model
{
    protected function casts(): array
    {
        return [
            'is_correct' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<ReadingItem, $this>
     */
    public function readingItem(): BelongsTo
    {
        return $this->belongsTo(ReadingItem::class);
    }
}
