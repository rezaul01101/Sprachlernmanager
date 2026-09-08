<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DayResource;
use App\Http\Resources\LevelResource;
use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LevelController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $levels = Level::where('is_published', true)
            ->withCount(['days' => fn ($query) => $query->where('is_published', true)])
            ->orderBy('sort_order')
            ->get();

        return LevelResource::collection($levels);
    }

    public function days(Request $request, string $code): AnonymousResourceCollection
    {
        $level = Level::where('code', $code)->where('is_published', true)->firstOrFail();

        $days = $level->days()->where('is_published', true)->orderBy('day_number')->get();

        return DayResource::collection($days);
    }
}
