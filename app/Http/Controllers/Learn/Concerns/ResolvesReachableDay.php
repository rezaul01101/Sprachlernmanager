<?php

namespace App\Http\Controllers\Learn\Concerns;

use App\Models\Day;
use App\Models\User;
use App\Services\DayProgressService;
use App\Services\LevelProgressService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

trait ResolvesReachableDay
{
    /**
     * Resolves the published Day for $levelCode/$dayNumber (with its
     * 'level' relation loaded), or a redirect back to the roadmap (with a
     * flash toast) if the day isn't reachable yet. Mobile only guards this
     * client-side; a browser address bar can otherwise bypass the
     * sequential-unlock rule entirely.
     */
    private function resolveReachableDay(
        LevelProgressService $levels,
        DayProgressService $days,
        User $user,
        string $levelCode,
        int $dayNumber,
    ): Day|RedirectResponse {
        $level = $levels->findPublishedByCode($levelCode);
        $levelWithStatus = $levels->publishedLevelsWithStatusFor($user)->firstWhere('id', $level->id);

        abort_if($levelWithStatus === null, 404);

        if (! $levels->isDayReachable($levelWithStatus, $dayNumber)) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('That day is still locked.')]);

            return to_route('learn.lessons.roadmap', $levelCode);
        }

        return $days->findPublishedDay($level, $dayNumber);
    }
}
