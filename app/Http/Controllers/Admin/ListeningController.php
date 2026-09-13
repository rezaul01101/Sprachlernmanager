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
            'days' => $level->days()->withExists('listeningItem')->orderBy('day_number')->get(),
        ]);
    }

    public function edit(Level $level, Day $day): Response
    {
        $item = $day->listeningItem()->with('options')->first();

        return Inertia::render('admin/listening/edit', [
            'level' => $level,
            'day' => $day,
            'item' => $item,
            'cards' => $day->vocabCards,
        ]);
    }

    public function update(Request $request, Level $level, Day $day): RedirectResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'in:audio,video'],
            'video_url' => ['nullable', 'url', 'max:2048', 'required_if:type,video'],
            'script' => ['nullable', 'string'],
            'title' => ['required', 'string', 'max:255'],
            'duration_label' => ['required', 'string', 'max:255'],
            'question' => ['required', 'string', 'max:255'],
            'options' => ['present', 'array'],
            'options.*.text' => ['required', 'string', 'max:255'],
            'options.*.is_correct' => ['boolean'],
            'options.*.explanation' => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($day, $validated) {
            $item = $day->listeningItem()->updateOrCreate([], [
                'type' => $validated['type'],
                'video_url' => $validated['video_url'] ?? null,
                'script' => $validated['script'] ?? null,
                'title' => $validated['title'],
                'duration_label' => $validated['duration_label'],
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

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Listening content saved.')]);

        return to_route('admin.levels.listening.edit', [$level, $day]);
    }
}
