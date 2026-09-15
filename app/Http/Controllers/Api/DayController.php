<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DayDetailResource;
use App\Services\DayProgressService;
use App\Services\LevelProgressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DayController extends Controller
{
    public function __construct(
        private readonly LevelProgressService $levels,
        private readonly DayProgressService $days,
    ) {}

    public function show(Request $request, string $code, int $dayNumber): DayDetailResource
    {
        $level = $this->levels->findPublishedByCode($code);
        $day = $this->days->findPublishedDay($level, $dayNumber);

        $progress = $this->days->progressArrayFor($request->user(), $day);

        return new DayDetailResource($day, $progress);
    }

    public function completeSkill(Request $request, string $code, int $dayNumber): JsonResponse
    {
        $validated = $request->validate([
            'skill' => ['required', 'in:wortschatz,hoeren,lesen,sprechen'],
        ]);

        $level = $this->levels->findPublishedByCode($code);
        $day = $this->days->findPublishedDay($level, $dayNumber);

        $result = $this->days->completeSkill($request->user(), $day, $validated['skill']);

        return response()->json($result);
    }
}
