<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DayDetailResource;
use App\Models\Day;
use App\Models\DayProgress;
use App\Models\Level;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DayController extends Controller
{
    public function show(Request $request, string $code, int $dayNumber): DayDetailResource
    {
        $day = $this->findDay($code, $dayNumber);

        $progress = DayProgress::where('user_id', $request->user()->id)
            ->where('day_id', $day->id)
            ->first();

        return new DayDetailResource($day, [
            'wortschatz' => (bool) $progress?->wortschatz,
            'hoeren' => (bool) $progress?->hoeren,
            'lesen' => (bool) $progress?->lesen,
            'sprechen' => (bool) $progress?->sprechen,
        ]);
    }

    public function completeSkill(Request $request, string $code, int $dayNumber): JsonResponse
    {
        $validated = $request->validate([
            'skill' => ['required', 'in:wortschatz,hoeren,lesen,sprechen'],
        ]);

        $day = $this->findDay($code, $dayNumber);

        $progress = DayProgress::firstOrCreate(
            ['user_id' => $request->user()->id, 'day_id' => $day->id],
            ['wortschatz' => false, 'hoeren' => false, 'lesen' => false, 'sprechen' => false],
        );

        $progress->{$validated['skill']} = true;

        $requiredSkills = [
            'wortschatz' => $day->vocabCards->isNotEmpty(),
            'hoeren' => $day->listeningItem !== null,
            'lesen' => $day->readingItem !== null,
            'sprechen' => $day->speakingItem !== null,
        ];

        $hasAnyContent = in_array(true, $requiredSkills, true);
        $allRequiredDone = collect($requiredSkills)
            ->filter()
            ->keys()
            ->every(fn (string $skill) => (bool) $progress->{$skill});

        $dayCompleted = $hasAnyContent && $allRequiredDone;
        $progress->completed_at = $dayCompleted ? ($progress->completed_at ?? now()) : null;
        $progress->save();

        return response()->json([
            'progress' => [
                'wortschatz' => (bool) $progress->wortschatz,
                'hoeren' => (bool) $progress->hoeren,
                'lesen' => (bool) $progress->lesen,
                'sprechen' => (bool) $progress->sprechen,
            ],
            'dayCompleted' => $dayCompleted,
        ]);
    }

    private function findDay(string $code, int $dayNumber): Day
    {
        $level = Level::where('code', $code)->where('is_published', true)->firstOrFail();

        return $level->days()
            ->where('day_number', $dayNumber)
            ->where('is_published', true)
            ->with(['vocabCards', 'listeningItem.options', 'readingItem.options', 'speakingItem.aiLines'])
            ->firstOrFail();
    }
}
