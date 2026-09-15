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

class ReadingController extends Controller
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

        return Inertia::render('learn/lessons/reading', [
            'level' => $day->level,
            'day' => ['id' => $day->id, 'day_number' => $day->day_number, 'focus_text' => $day->focus_text],
            'readingItem' => $day->readingItem,
        ]);
    }
}
