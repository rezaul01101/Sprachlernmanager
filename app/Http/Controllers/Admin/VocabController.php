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

class VocabController extends Controller
{
    public function index(Level $level): Response
    {
        return Inertia::render('admin/vocab/index', [
            'level' => $level,
            'days' => $level->days()->withCount('vocabCards')->orderBy('day_number')->get(),
        ]);
    }

    public function edit(Level $level, Day $day): Response
    {
        return Inertia::render('admin/vocab/edit', [
            'level' => $level,
            'day' => $day,
            'cards' => $day->vocabCards,
        ]);
    }

    public function update(Request $request, Level $level, Day $day): RedirectResponse
    {
        $validated = $request->validate([
            'cards' => ['present', 'array'],
            'cards.*.word' => ['required', 'string', 'max:255'],
            'cards.*.tag' => ['nullable', 'string', 'max:255'],
            'cards.*.translation_en' => ['required', 'string', 'max:255'],
            'cards.*.translation_bn' => ['nullable', 'string', 'max:255'],
            'cards.*.example' => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($day, $validated) {
            $day->vocabCards()->delete();

            foreach ($validated['cards'] as $index => $card) {
                $day->vocabCards()->create([
                    'word' => $card['word'],
                    'tag' => $card['tag'] ?? null,
                    'translation_en' => $card['translation_en'],
                    'translation_bn' => $card['translation_bn'] ?? null,
                    'example' => $card['example'] ?? null,
                    'sort_order' => $index + 1,
                ]);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Vocabulary saved.')]);

        return to_route('admin.levels.vocab.edit', [$level, $day]);
    }
}
