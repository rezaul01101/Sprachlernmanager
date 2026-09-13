<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreDayRequest;
use App\Http\Requests\Admin\UpdateDayRequest;
use App\Models\Day;
use App\Models\Level;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DayController extends Controller
{
    public function index(Level $level): Response
    {
        return Inertia::render('admin/days/index', [
            'level' => $level,
            'days' => $level->days,
        ]);
    }

    public function show(Level $level, Day $day): Response
    {
        return Inertia::render('admin/days/show', [
            'level' => $level,
            'day' => $day->loadCount('vocabCards')->loadExists(['listeningItem', 'readingItem', 'speakingItem']),
        ]);
    }

    public function create(Level $level): Response
    {
        return Inertia::render('admin/days/create', [
            'level' => $level,
        ]);
    }

    public function store(StoreDayRequest $request, Level $level): RedirectResponse
    {
        // Unchecked switches are omitted from the request entirely (native
        // checkbox semantics), so cast explicitly rather than trusting validated().
        $level->days()->create([...$request->validated(), 'is_published' => $request->boolean('is_published')]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Day created.')]);

        return to_route('admin.levels.days.index', $level);
    }

    public function edit(Level $level, Day $day): Response
    {
        return Inertia::render('admin/days/edit', [
            'level' => $level,
            'day' => $day,
        ]);
    }

    public function update(UpdateDayRequest $request, Level $level, Day $day): RedirectResponse
    {
        $day->update([...$request->validated(), 'is_published' => $request->boolean('is_published')]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Day updated.')]);

        return to_route('admin.levels.days.index', $level);
    }

    public function destroy(Level $level, Day $day): RedirectResponse
    {
        $day->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Day deleted.')]);

        return to_route('admin.levels.days.index', $level);
    }
}
