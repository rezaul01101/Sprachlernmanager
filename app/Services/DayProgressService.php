<?php

namespace App\Services;

use App\Models\Day;
use App\Models\DayProgress;
use App\Models\Level;
use App\Models\User;

class DayProgressService
{
    public function findPublishedDay(Level $level, int $dayNumber): Day
    {
        return $level->days()
            ->where('day_number', $dayNumber)
            ->where('is_published', true)
            ->with(['level', 'vocabCards', 'listeningItems', 'readingItem', 'speakingItem'])
            ->firstOrFail();
    }

    /**
     * @return array{wortschatz: bool, hoeren: bool, lesen: bool, sprechen: bool}
     */
    public function progressArrayFor(User $user, Day $day): array
    {
        $progress = DayProgress::where('user_id', $user->id)
            ->where('day_id', $day->id)
            ->first();

        return [
            'wortschatz' => (bool) $progress?->wortschatz,
            'hoeren' => (bool) $progress?->hoeren,
            'lesen' => (bool) $progress?->lesen,
            'sprechen' => (bool) $progress?->sprechen,
        ];
    }

    /**
     * Which skills actually have content for this day — a skill with no
     * content isn't required for the day to be considered complete.
     *
     * @return array{wortschatz: bool, hoeren: bool, lesen: bool, sprechen: bool}
     */
    public function requiredSkills(Day $day): array
    {
        return [
            'wortschatz' => $day->vocabCards->isNotEmpty(),
            'hoeren' => $day->listeningItems->isNotEmpty(),
            'lesen' => $day->readingItem !== null,
            'sprechen' => $day->speakingItem !== null,
        ];
    }

    /**
     * Server-side version of the hasContent/doneCount/isDayComplete math the
     * mobile client currently recomputes itself from a DayDetail response.
     *
     * @param  array{wortschatz: bool, hoeren: bool, lesen: bool, sprechen: bool}  $progress
     * @return array{requiredSkills: list<string>, doneCount: int, isDayComplete: bool}
     */
    public function completionSummary(Day $day, array $progress): array
    {
        $required = collect($this->requiredSkills($day))->filter()->keys();

        $doneCount = $required->filter(fn (string $skill) => $progress[$skill])->count();

        return [
            'requiredSkills' => $required->values()->all(),
            'doneCount' => $doneCount,
            'isDayComplete' => $required->isNotEmpty() && $doneCount === $required->count(),
        ];
    }

    /**
     * @return array{progress: array{wortschatz: bool, hoeren: bool, lesen: bool, sprechen: bool}, dayCompleted: bool}
     */
    public function completeSkill(User $user, Day $day, string $skill): array
    {
        $progress = DayProgress::firstOrCreate(
            ['user_id' => $user->id, 'day_id' => $day->id],
            ['wortschatz' => false, 'hoeren' => false, 'lesen' => false, 'sprechen' => false],
        );

        $progress->{$skill} = true;

        $requiredSkills = $this->requiredSkills($day);

        $hasAnyContent = in_array(true, $requiredSkills, true);
        $allRequiredDone = collect($requiredSkills)
            ->filter()
            ->keys()
            ->every(fn (string $requiredSkill) => (bool) $progress->{$requiredSkill});

        $dayCompleted = $hasAnyContent && $allRequiredDone;
        $progress->completed_at = $dayCompleted ? ($progress->completed_at ?? now()) : null;
        $progress->save();

        return [
            'progress' => [
                'wortschatz' => (bool) $progress->wortschatz,
                'hoeren' => (bool) $progress->hoeren,
                'lesen' => (bool) $progress->lesen,
                'sprechen' => (bool) $progress->sprechen,
            ],
            'dayCompleted' => $dayCompleted,
        ];
    }
}
