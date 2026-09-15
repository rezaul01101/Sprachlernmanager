<?php

namespace App\Http\Controllers\Learn;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Learn\Concerns\ResolvesReachableDay;
use App\Services\DayProgressService;
use App\Services\LevelProgressService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DayController extends Controller
{
    use ResolvesReachableDay;

    public function __construct(
        private readonly LevelProgressService $levels,
        private readonly DayProgressService $days,
    ) {}

    public function show(Request $request, string $levelCode, int $dayNumber): Response|RedirectResponse
    {
        $day = $this->resolveReachableDay($this->levels, $this->days, $request->user(), $levelCode, $dayNumber);

        if ($day instanceof RedirectResponse) {
            return $day;
        }

        $progress = $this->days->progressArrayFor($request->user(), $day);

        return Inertia::render('learn/lessons/day', [
            'level' => $day->level,
            'day' => ['id' => $day->id, 'day_number' => $day->day_number, 'focus_text' => $day->focus_text],
            'progress' => $progress,
            'completionSummary' => $this->days->completionSummary($day, $progress),
        ]);
    }

    public function completeSkill(Request $request, string $levelCode, int $dayNumber): RedirectResponse
    {
        $validated = $request->validate([
            'skill' => ['required', 'in:wortschatz,hoeren,lesen,sprechen'],
        ]);

        $level = $this->levels->findPublishedByCode($levelCode);
        $day = $this->days->findPublishedDay($level, $dayNumber);

        $this->days->completeSkill($request->user(), $day, $validated['skill']);

        return to_route('learn.lessons.day', [$levelCode, $dayNumber]);
    }
}
