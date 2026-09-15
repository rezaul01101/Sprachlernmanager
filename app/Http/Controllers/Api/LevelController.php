<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DayResource;
use App\Http\Resources\LevelResource;
use App\Models\User;
use App\Services\LevelProgressService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class LevelController extends Controller
{
    public function __construct(private readonly LevelProgressService $levels) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        /** @var User $user */
        $user = $request->user();

        return LevelResource::collection($this->levels->publishedLevelsWithStatusFor($user));
    }

    public function enroll(Request $request, string $code): Response
    {
        $level = $this->levels->findPublishedByCode($code);

        $this->levels->enroll($request->user(), $level);

        return response()->noContent();
    }

    public function days(Request $request, string $code): AnonymousResourceCollection
    {
        $level = $this->levels->findPublishedByCode($code);

        return DayResource::collection($this->levels->publishedDaysFor($level));
    }
}
