<?php

namespace App\Http\Controllers\Learn;

use App\Http\Controllers\Controller;
use App\Models\Grammar;
use Inertia\Inertia;
use Inertia\Response;

class GrammarController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('learn/grammar/index', [
            'grammars' => Grammar::query()->orderBy('title')->get(['id', 'title', 'image_path']),
        ]);
    }

    public function show(Grammar $grammar): Response
    {
        return Inertia::render('learn/grammar/show', [
            'grammar' => $grammar->only(['id', 'title', 'description', 'image_url']),
        ]);
    }
}
