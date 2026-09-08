<?php

namespace App\Models;

use Database\Factories\VocabCardFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $day_id
 * @property string $word
 * @property string|null $tag
 * @property string $translation_en
 * @property string|null $translation_bn
 * @property string|null $example
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['day_id', 'word', 'tag', 'translation_en', 'translation_bn', 'example', 'sort_order'])]
class VocabCard extends Model
{
    /** @use HasFactory<VocabCardFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<Day, $this>
     */
    public function day(): BelongsTo
    {
        return $this->belongsTo(Day::class);
    }
}
