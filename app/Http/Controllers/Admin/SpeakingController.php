<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Day;
use App\Models\Level;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SpeakingController extends Controller
{
    public function index(Level $level): Response
    {
        return Inertia::render('admin/speaking/index', [
            'level' => $level,
            'days' => $level->days()->withExists('speakingItem')->orderBy('day_number')->get(),
        ]);
    }

    public function edit(Level $level, Day $day): Response
    {
        return Inertia::render('admin/speaking/edit', [
            'level' => $level,
            'day' => $day,
            'item' => $day->speakingItem,
            'cards' => $day->vocabCards,
        ]);
    }

    public function update(Request $request, Level $level, Day $day): RedirectResponse
    {
        $validated = $request->validate([
            'dialogue' => ['present', 'array', 'min:1'],
            'dialogue.*.german' => ['required', 'string'],
            'dialogue.*.english' => ['required', 'string'],
            'dialogue.*.pronounce' => ['nullable', 'string'],
            'words' => ['present', 'array'],
            'words.*.german' => ['required', 'string', 'max:255'],
            'words.*.english' => ['required', 'string', 'max:255'],
            'words.*.pronounce' => ['nullable', 'string', 'max:255'],
        ]);

        $day->speakingItem()->updateOrCreate([], [
            'dialogue' => array_map(fn (array $line) => [
                'german' => $line['german'],
                'english' => $line['english'],
                'pronounce' => $line['pronounce'] ?? null,
            ], $validated['dialogue']),
            'words' => array_map(fn (array $word) => [
                'german' => $word['german'],
                'english' => $word['english'],
                'pronounce' => $word['pronounce'] ?? null,
            ], $validated['words']),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Speaking content saved.')]);

        return to_route('admin.levels.speaking.edit', [$level, $day]);
    }
}
