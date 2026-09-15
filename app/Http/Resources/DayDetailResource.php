<?php

namespace App\Http\Resources;

use App\Models\Day;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Day */
class DayDetailResource extends JsonResource
{
    /**
     * @param  array{wortschatz: bool, hoeren: bool, lesen: bool, sprechen: bool}  $progress
     */
    public function __construct(Day $resource, private readonly array $progress)
    {
        parent::__construct($resource);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'day' => $this->day_number,
            'focusText' => $this->focus_text,
            'progress' => $this->progress,
            'vocab' => $this->vocabCards->map(fn ($card) => [
                'word' => $card->word,
                'pronounce' => $card->pronounce,
                'tag' => $card->tag,
                'translation_en' => $card->translation_en,
                'translation_bn' => $card->translation_bn,
                'example' => $card->example,
            ]),
            'listening' => $this->listeningItems->map(fn ($item) => [
                'type' => $item->type,
                'videoUrl' => $item->video_url,
                'script' => $item->script,
                'title' => $item->title,
                'durationLabel' => $item->duration_label,
                'words' => $item->words ?? [],
            ]),
            'reading' => $this->readingItem ? [
                'instruction' => $this->readingItem->instruction,
                'articleUrl' => $this->readingItem->article_url,
                'passage' => $this->readingItem->passage,
                'words' => $this->readingItem->words ?? [],
            ] : null,
            'speaking' => $this->speakingItem ? [
                'targetSentence' => $this->speakingItem->target_sentence,
                'aiLines' => $this->speakingItem->aiLines->pluck('text'),
            ] : null,
        ];
    }
}
