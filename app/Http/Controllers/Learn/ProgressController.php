<?php

namespace App\Http\Controllers\Learn;

use App\Http\Controllers\Controller;
use App\Services\LevelProgressService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProgressController extends Controller
{
    public function __construct(private readonly LevelProgressService $levels) {}

    public function index(Request $request): Response
    {
        return Inertia::render('learn/progress/index', [
            'levels' => $this->levels->publishedLevelsWithStatusFor($request->user()),
        ]);
    }
}
