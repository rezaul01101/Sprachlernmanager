<?php

namespace App\Http\Controllers\Learn;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ReferenceController extends Controller
{
    public function show(string $topic): Response
    {
        return Inertia::render('learn/reference/show', ['topic' => $topic]);
    }
}
