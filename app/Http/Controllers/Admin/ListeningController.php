<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Day;
use App\Models\Level;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ListeningController extends Controller
{
    public function index(Level $level): Response
    {
        return Inertia::render('admin/listening/index', [
            'level' => $level,
            'days' => $level->days()->withCount('listeningItems')->orderBy('day_number')->get(),
        ]);
    }

    public function edit(Level $level, Day $day): Response
    {
        return Inertia::render('admin/listening/edit', [
            'level' => $level,
            'day' => $day,
            'items' => $day->listeningItems,
            'cards' => $day->vocabCards,
        ]);
    }

    public function update(Request $request, Level $level, Day $day): RedirectResponse
    {
        $validated = $request->validate([
            'items' => ['present', 'array'],
            'items.*.type' => ['required', 'in:audio,video'],
            'items.*.video_url' => ['nullable', 'url', 'max:2048', 'required_if:items.*.type,video'],
            'items.*.script' => ['nullable', 'string'],
            'items.*.title' => ['required', 'string', 'max:255'],
            'items.*.duration_label' => ['required', 'string', 'max:255'],
            'items.*.words' => ['present', 'array'],
            'items.*.words.*.word' => ['required', 'string', 'max:255'],
            'items.*.words.*.pronounce' => ['nullable', 'string', 'max:255'],
            'items.*.words.*.meaning' => ['nullable', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($day, $validated) {
            $day->listeningItems()->delete();

            foreach ($validated['items'] as $index => $item) {
                $day->listeningItems()->create([
                    'type' => $item['type'],
                    'video_url' => $item['video_url'] ?? null,
                    'script' => $item['script'] ?? null,
                    'title' => $item['title'],
                    'duration_label' => $item['duration_label'],
                    'words' => array_map(fn (array $word) => [
                        'word' => $word['word'],
                        'pronounce' => $word['pronounce'] ?? null,
                        'meaning' => $word['meaning'] ?? null,
                    ], $item['words']),
                    'sort_order' => $index + 1,
                ]);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Listening content saved.')]);

        return to_route('admin.levels.listening.edit', [$level, $day]);
    }
}
