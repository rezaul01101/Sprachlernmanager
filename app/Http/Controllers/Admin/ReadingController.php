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
        $item = $day->readingItem()->with('options')->first();

        return Inertia::render('admin/reading/edit', [
            'level' => $level,
            'day' => $day,
            'item' => $item,
            'cards' => $day->vocabCards,
        ]);
    }

    public function update(Request $request, Level $level, Day $day): RedirectResponse
    {
        $validated = $request->validate([
            'instruction' => ['required', 'string'],
            'article_url' => ['nullable', 'url', 'max:2048'],
            'passage' => ['required', 'string'],
            'question' => ['required', 'string', 'max:255'],
            'options' => ['present', 'array'],
            'options.*.text' => ['required', 'string', 'max:255'],
            'options.*.is_correct' => ['boolean'],
            'options.*.explanation' => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($day, $validated) {
            $item = $day->readingItem()->updateOrCreate([], [
                'instruction' => $validated['instruction'],
                'article_url' => $validated['article_url'] ?? null,
                'passage' => $validated['passage'],
                'question' => $validated['question'],
            ]);

            $item->options()->delete();

            foreach ($validated['options'] as $index => $option) {
                $item->options()->create([
                    'text' => $option['text'],
                    'is_correct' => $option['is_correct'] ?? false,
                    'explanation' => $option['explanation'] ?? null,
                    'sort_order' => $index + 1,
                ]);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Reading content saved.')]);

        return to_route('admin.levels.reading.edit', [$level, $day]);
    }
}
