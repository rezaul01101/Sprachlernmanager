<?php

namespace App\Http\Controllers\Learn;

use App\Http\Controllers\Controller;
use App\Services\LevelProgressService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LevelController extends Controller
{
    public function __construct(private readonly LevelProgressService $levels) {}

    public function index(Request $request): Response
    {
        return Inertia::render('learn/lessons/index', [
            'levels' => $this->levels->publishedLevelsWithStatusFor($request->user()),
        ]);
    }

    public function roadmap(Request $request, string $levelCode): Response
    {
        $level = $this->levels->findPublishedByCode($levelCode);
        $user = $request->user();

        $levelWithStatus = $this->levels->publishedLevelsWithStatusFor($user)
            ->firstWhere('id', $level->id);

        abort_if($levelWithStatus === null, 404);

        if ($levelWithStatus->status !== 'locked') {
            $this->levels->enroll($user, $level);
            $levelWithStatus->setAttribute('enrolled', true);
        }

        return Inertia::render('learn/lessons/roadmap', [
            'level' => $levelWithStatus,
        ]);
    }
}
