<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DayResource;
use App\Http\Resources\LevelResource;
use App\Models\DayProgress;
use App\Models\Level;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class LevelController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        /** @var User $user */
        $user = $request->user();

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

        return LevelResource::collection($levels);
    }

    public function enroll(Request $request, string $code): Response
    {
        $level = Level::where('code', $code)->where('is_published', true)->firstOrFail();

        $request->user()->enrollments()->firstOrCreate(
            ['level_id' => $level->id],
            ['enrolled_at' => now()],
        );

        return response()->noContent();
    }

    public function days(Request $request, string $code): AnonymousResourceCollection
    {
        $level = Level::where('code', $code)->where('is_published', true)->firstOrFail();

        $days = $level->days()->where('is_published', true)->orderBy('day_number')->get();

        return DayResource::collection($days);
    }

    /**
     * Count of fully-complete days, contiguous from day 1 — matches the
     * sequential unlock rule (a day only becomes reachable once the
     * previous one is done, so gaps shouldn't occur, but this stays
     * correct even if one ever did).
     */
    private function countDoneDays(User $user, Level $level): int
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
}
