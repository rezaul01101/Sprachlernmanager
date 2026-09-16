<?php

use App\Http\Controllers\EmbedController;
use App\Http\Controllers\Learn\HomeController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('/embed/youtube/{videoId}', [EmbedController::class, 'youtube'])
    ->where('videoId', '[A-Za-z0-9_-]{6,20}')
    ->name('embed.youtube');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [HomeController::class, 'index'])->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
require __DIR__.'/learn.php';
