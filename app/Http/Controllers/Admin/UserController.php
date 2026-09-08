<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/users/index', [
            'users' => User::withCount('tokens')->orderByDesc('created_at')->get(),
        ]);
    }

    public function show(User $user): Response
    {
        $user->loadCount('tokens');

        return Inertia::render('admin/users/show', [
            'user' => $user,
        ]);
    }

    public function revokeTokens(User $user): RedirectResponse
    {
        $user->tokens()->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Tokens revoked.')]);

        return back();
    }
}
