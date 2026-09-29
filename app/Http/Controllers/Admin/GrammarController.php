<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGrammarRequest;
use App\Http\Requests\Admin\UpdateGrammarRequest;
use App\Models\Grammar;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GrammarController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/grammar/index', [
            'grammars' => Grammar::query()->latest()->get(['id', 'title', 'description', 'image_path', 'updated_at']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/grammar/create');
    }

    public function store(StoreGrammarRequest $request): RedirectResponse
    {
        $data = $request->grammarData();

        if ($image = $request->file('image')) {
            $data['image_path'] = $image->store('grammars', 'public');
        }

        Grammar::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Grammar created.')]);

        return to_route('admin.grammars.index');
    }

    public function edit(Grammar $grammar): Response
    {
        return Inertia::render('admin/grammar/edit', [
            'grammar' => $grammar,
        ]);
    }

    public function update(UpdateGrammarRequest $request, Grammar $grammar): RedirectResponse
    {
        $data = $request->grammarData();

        if ($image = $request->file('image')) {
            $this->deleteImage($grammar);
            $data['image_path'] = $image->store('grammars', 'public');
        } elseif ($request->boolean('remove_image')) {
            $this->deleteImage($grammar);
            $data['image_path'] = null;
        }

        $grammar->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Grammar updated.')]);

        return to_route('admin.grammars.index');
    }

    public function destroy(Grammar $grammar): RedirectResponse
    {
        $this->deleteImage($grammar);
        $grammar->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Grammar deleted.')]);

        return to_route('admin.grammars.index');
    }

    private function deleteImage(Grammar $grammar): void
    {
        if ($grammar->image_path) {
            Storage::disk('public')->delete($grammar->image_path);
        }
    }
}
