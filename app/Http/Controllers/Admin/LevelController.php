<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreLevelRequest;
use App\Http\Requests\Admin\UpdateLevelRequest;
use App\Models\Level;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LevelController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/levels/index', [
            'levels' => Level::withCount('days')->orderBy('sort_order')->get(),
        ]);
    }

    public function show(Level $level): Response
    {
        return Inertia::render('admin/levels/show', [
            'level' => $level,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/levels/create');
    }

    public function store(StoreLevelRequest $request): RedirectResponse
    {
        // Unchecked switches are omitted from the request entirely (native
        // checkbox semantics), so cast explicitly rather than trusting validated().
        Level::create([...$request->validated(), 'is_published' => $request->boolean('is_published')]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Level created.')]);

        return to_route('admin.levels.index');
    }

    public function edit(Level $level): Response
    {
        return Inertia::render('admin/levels/edit', [
            'level' => $level,
        ]);
    }

    public function update(UpdateLevelRequest $request, Level $level): RedirectResponse
    {
        $level->update([...$request->validated(), 'is_published' => $request->boolean('is_published')]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Level updated.')]);

        return to_route('admin.levels.index');
    }

    public function destroy(Level $level): RedirectResponse
    {
        $level->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Level deleted.')]);

        return to_route('admin.levels.index');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $ids = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:levels,id'],
        ])['ids'];

        DB::transaction(function () use ($ids) {
            // Two passes (via a high offset, sort_order is unsigned) avoid
            // transiently colliding with the unique constraint while ids
            // are still in their old order.
            foreach ($ids as $index => $id) {
                Level::whereKey($id)->update(['sort_order' => 1_000_000 + $index]);
            }
            foreach ($ids as $index => $id) {
                Level::whereKey($id)->update(['sort_order' => $index + 1]);
            }
        });

        return back();
    }
}
