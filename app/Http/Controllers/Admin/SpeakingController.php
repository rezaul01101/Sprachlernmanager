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
        $item = $day->speakingItem()->with('aiLines')->first();

        return Inertia::render('admin/speaking/edit', [
            'level' => $level,
            'day' => $day,
            'item' => $item,
            'cards' => $day->vocabCards,
        ]);
    }

    public function update(Request $request, Level $level, Day $day): RedirectResponse
    {
        $validated = $request->validate([
            'target_sentence' => ['required', 'string'],
            'ai_lines' => ['present', 'array', 'min:1'],
            'ai_lines.*.text' => ['required', 'string'],
        ]);

        DB::transaction(function () use ($day, $validated) {
            $item = $day->speakingItem()->updateOrCreate([], [
                'target_sentence' => $validated['target_sentence'],
            ]);

            $item->aiLines()->delete();

            foreach ($validated['ai_lines'] as $index => $line) {
                $item->aiLines()->create([
                    'text' => $line['text'],
                    'sort_order' => $index + 1,
                ]);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Speaking content saved.')]);

        return to_route('admin.levels.speaking.edit', [$level, $day]);
    }
}
