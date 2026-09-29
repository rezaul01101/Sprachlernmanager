<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GrammarResource;
use App\Models\Grammar;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GrammarController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return GrammarResource::collection(Grammar::query()->orderBy('title')->get(['id', 'title', 'image_path']));
    }

    public function show(Grammar $grammar): GrammarResource
    {
        return new GrammarResource($grammar);
    }
}
