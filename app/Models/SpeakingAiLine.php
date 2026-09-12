<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $speaking_item_id
 * @property string $text
 * @property int $sort_order
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Fillable(['speaking_item_id', 'text', 'sort_order'])]
class SpeakingAiLine extends Model
{
    /**
     * @return BelongsTo<SpeakingItem, $this>
     */
    public function speakingItem(): BelongsTo
    {
        return $this->belongsTo(SpeakingItem::class);
    }
}
