<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Day;
use App\Models\Level;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReadingController extends Controller
{
    public function index(Level $level): Response
    {
        return Inertia::render('admin/reading/index', [
            'level' => $level,
            'days' => $level->days()->withExists('readingItem')->orderBy('day_number')->get(),
        ]);
    }

    public function edit(Level $level, Day $day): Response
    {
        return Inertia::render('admin/reading/edit', [
            'level' => $level,
            'day' => $day,
            'item' => $day->readingItem,
            'cards' => $day->vocabCards,
        ]);
    }

    public function update(Request $request, Level $level, Day $day): RedirectResponse
    {
        $validated = $request->validate([
            'instruction' => ['required', 'string'],
            'article_url' => ['nullable', 'url', 'max:2048'],
            'passage' => ['required', 'string'],
            'words' => ['present', 'array'],
            'words.*.word' => ['required', 'string', 'max:255'],
            'words.*.pronounce' => ['nullable', 'string', 'max:255'],
            'words.*.meaning' => ['nullable', 'string', 'max:255'],
        ]);

        $day->readingItem()->updateOrCreate([], [
            'instruction' => $validated['instruction'],
            'article_url' => $validated['article_url'] ?? null,
            'passage' => $validated['passage'],
            'words' => array_map(fn (array $word) => [
                'word' => $word['word'],
                'pronounce' => $word['pronounce'] ?? null,
                'meaning' => $word['meaning'] ?? null,
            ], $validated['words']),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Reading content saved.')]);

        return to_route('admin.levels.reading.edit', [$level, $day]);
    }
}
