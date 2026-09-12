<?php

namespace App\Http\Resources;

use App\Models\Day;
use App\Models\ListeningOption;
use App\Models\ReadingOption;
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
                'tag' => $card->tag,
                'translation_en' => $card->translation_en,
                'translation_bn' => $card->translation_bn,
                'example' => $card->example,
            ]),
            'listening' => $this->listeningItem ? [
                'type' => $this->listeningItem->type,
                'title' => $this->listeningItem->title,
                'durationLabel' => $this->listeningItem->duration_label,
                'question' => $this->listeningItem->question,
                'options' => $this->mapOptions($this->listeningItem->options),
            ] : null,
            'reading' => $this->readingItem ? [
                'instruction' => $this->readingItem->instruction,
                'passage' => $this->readingItem->passage,
                'question' => $this->readingItem->question,
                'options' => $this->mapOptions($this->readingItem->options),
            ] : null,
            'speaking' => $this->speakingItem ? [
                'targetSentence' => $this->speakingItem->target_sentence,
                'aiLines' => $this->speakingItem->aiLines->pluck('text'),
            ] : null,
        ];
    }

    /**
     * @param  iterable<ListeningOption|ReadingOption>  $options
     * @return array<int, array<string, mixed>>
     */
    private function mapOptions(iterable $options): array
    {
        $mapped = [];

        foreach ($options as $option) {
            $mapped[] = [
                'text' => $option->text,
                'correct' => $option->is_correct,
                'explanation' => $option->explanation ?? '',
            ];
        }

        return $mapped;
    }
}
