<?php

namespace App\Services;

use App\Models\Day;
use App\Models\DayProgress;
use App\Models\Enrollment;
use App\Models\Level;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class LevelProgressService
{
    public function findPublishedByCode(string $code): Level
    {
        return Level::where('code', $code)->where('is_published', true)->firstOrFail();
    }

    /**
     * All published levels with runtime-only done_days/status/enrolled
     * attributes computed for the given user. status is 'done' once every
     * day is complete, 'current' for the first not-yet-done level, and
     * 'locked' for everything after that — levels unlock strictly in order.
     *
     * @return Collection<int, Level>
     */
    public function publishedLevelsWithStatusFor(User $user): Collection
    {
        $levels = Level::where('is_published', true)
            ->withCount(['days' => fn ($query) => $query->where('is_published', true)])
            ->orderBy('sort_order')
            ->get();

        $enrolledLevelIds = $user->enrollments()->pluck('level_id')->all();

        $previousDone = true;

        $levels->each(function (Level $level) use ($user, $enrolledLevelIds, &$previousDone) {
            $totalDays = $level->days_count;
            $doneDays = $this->countDoneDays($user, $level);
            $isDone = $totalDays > 0 && $doneDays >= $totalDays;

            $status = match (true) {
                $isDone => 'done',
                $previousDone => 'current',
                default => 'locked',
            };

            if (! $isDone) {
                $previousDone = false;
            }

            $level->setAttribute('done_days', $doneDays);
            $level->setAttribute('status', $status);
            $level->setAttribute('enrolled', in_array($level->id, $enrolledLevelIds, true));
        });

        return $levels;
    }

    /**
     * Count of fully-complete days, contiguous from day 1 — matches the
     * sequential unlock rule (a day only becomes reachable once the
     * previous one is done, so gaps shouldn't occur, but this stays
     * correct even if one ever did).
     */
    public function countDoneDays(User $user, Level $level): int
    {
        $completedDayNumbers = DayProgress::query()
            ->join('days', 'days.id', '=', 'day_progress.day_id')
            ->where('day_progress.user_id', $user->id)
            ->where('days.level_id', $level->id)
            ->whereNotNull('day_progress.completed_at')
            ->orderBy('days.day_number')
            ->pluck('days.day_number');

        $count = 0;
        foreach ($completedDayNumbers as $dayNumber) {
            if ((int) $dayNumber !== $count + 1) {
                break;
            }
            $count++;
        }

        return $count;
    }

    public function enroll(User $user, Level $level): Enrollment
    {
        return $user->enrollments()->firstOrCreate(
            ['level_id' => $level->id],
            ['enrolled_at' => now()],
        );
    }

    /**
     * @return Collection<int, Day>
     */
    public function publishedDaysFor(Level $level): Collection
    {
        return $level->days()->where('is_published', true)->orderBy('day_number')->get();
    }

    /**
     * Whether $dayNumber is reachable for a user, given a Level already
     * carrying the runtime status/done_days attributes set by
     * publishedLevelsWithStatusFor(). A day is reachable once every day
     * before it is done — mirrors the mobile client's roadmap lock logic,
     * enforced here server-side since a browser address bar can otherwise
     * bypass a client-only check.
     */
    public function isDayReachable(Level $levelWithStatus, int $dayNumber): bool
    {
        if ($levelWithStatus->status === 'locked') {
            return false;
        }

        return $dayNumber <= $levelWithStatus->done_days + 1;
    }
}
