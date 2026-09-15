<?php

namespace App\Http\Controllers\Learn;

use App\Http\Controllers\Controller;
use App\Services\DayProgressService;
use App\Services\LevelProgressService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private readonly LevelProgressService $levels,
        private readonly DayProgressService $days,
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $levels = $this->levels->publishedLevelsWithStatusFor($user);

        $currentLevel = $levels->firstWhere('status', 'current') ?? $levels->first();

        if ($currentLevel === null || $currentLevel->days_count === 0) {
            return Inertia::render('learn/home', [
                'currentLevel' => null,
                'currentDayNumber' => null,
                'progress' => null,
                'completionSummary' => null,
            ]);
        }

        $currentDayNumber = min($currentLevel->done_days + 1, $currentLevel->days_count);
        $day = $this->days->findPublishedDay($currentLevel, $currentDayNumber);
        $progress = $this->days->progressArrayFor($user, $day);

        return Inertia::render('learn/home', [
            'currentLevel' => $currentLevel,
            'currentDayNumber' => $currentDayNumber,
            'progress' => $progress,
            'completionSummary' => $this->days->completionSummary($day, $progress),
        ]);
    }
}
