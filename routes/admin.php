<?php

use App\Http\Controllers\Admin\DayController;
use App\Http\Controllers\Admin\LevelController;
use App\Http\Controllers\Admin\ListeningController;
use App\Http\Controllers\Admin\ReadingController;
use App\Http\Controllers\Admin\SpeakingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VocabController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->scopeBindings()->group(function () {
    Route::get('levels', [LevelController::class, 'index'])->name('levels.index');
    Route::get('levels/create', [LevelController::class, 'create'])->name('levels.create');
    Route::post('levels', [LevelController::class, 'store'])->name('levels.store');
    Route::post('levels/reorder', [LevelController::class, 'reorder'])->name('levels.reorder');
    Route::get('levels/{level}/edit', [LevelController::class, 'edit'])->name('levels.edit');
    Route::put('levels/{level}', [LevelController::class, 'update'])->name('levels.update');
    Route::delete('levels/{level}', [LevelController::class, 'destroy'])->name('levels.destroy');

    // scopeBindings() ensures {day} must belong to the {level} in the same URL,
    // not just match by id — otherwise a day from another level would 200 here.
    Route::get('levels/{level}/vocab', [VocabController::class, 'index'])->name('levels.vocab.index');
    Route::get('levels/{level}/vocab/{day}', [VocabController::class, 'edit'])->name('levels.vocab.edit');
    Route::put('levels/{level}/vocab/{day}', [VocabController::class, 'update'])->name('levels.vocab.update');

    Route::get('levels/{level}/listening', [ListeningController::class, 'index'])->name('levels.listening.index');
    Route::get('levels/{level}/listening/{day}', [ListeningController::class, 'edit'])->name('levels.listening.edit');
    Route::put('levels/{level}/listening/{day}', [ListeningController::class, 'update'])->name('levels.listening.update');

    Route::get('levels/{level}/reading', [ReadingController::class, 'index'])->name('levels.reading.index');
    Route::get('levels/{level}/reading/{day}', [ReadingController::class, 'edit'])->name('levels.reading.edit');
    Route::put('levels/{level}/reading/{day}', [ReadingController::class, 'update'])->name('levels.reading.update');

    Route::get('levels/{level}/speaking', [SpeakingController::class, 'index'])->name('levels.speaking.index');
    Route::get('levels/{level}/speaking/{day}', [SpeakingController::class, 'edit'])->name('levels.speaking.edit');
    Route::put('levels/{level}/speaking/{day}', [SpeakingController::class, 'update'])->name('levels.speaking.update');

    Route::get('levels/{level}/days', [DayController::class, 'index'])->name('levels.days.index');
    Route::get('levels/{level}/days/create', [DayController::class, 'create'])->name('levels.days.create');
    Route::post('levels/{level}/days', [DayController::class, 'store'])->name('levels.days.store');
    // Registered after 'days/create' so the literal segment wins the match
    // there instead of being captured as the {day} parameter.
    Route::get('levels/{level}/days/{day}', [DayController::class, 'show'])->name('levels.days.show');
    Route::get('levels/{level}/days/{day}/edit', [DayController::class, 'edit'])->name('levels.days.edit');
    Route::put('levels/{level}/days/{day}', [DayController::class, 'update'])->name('levels.days.update');
    Route::delete('levels/{level}/days/{day}', [DayController::class, 'destroy'])->name('levels.days.destroy');

    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::post('users/{user}/revoke-tokens', [UserController::class, 'revokeTokens'])->name('users.revoke-tokens');
});
