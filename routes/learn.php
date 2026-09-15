<?php

use App\Http\Controllers\Learn\DayController;
use App\Http\Controllers\Learn\LevelController;
use App\Http\Controllers\Learn\ListeningController;
use App\Http\Controllers\Learn\ProgressController;
use App\Http\Controllers\Learn\ReadingController;
use App\Http\Controllers\Learn\RewardController;
use App\Http\Controllers\Learn\SpeakingController;
use App\Http\Controllers\Learn\VocabController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('learn')->name('learn.')->group(function () {
    Route::get('lessons', [LevelController::class, 'index'])->name('lessons.index');
    Route::get('lessons/{levelCode}', [LevelController::class, 'roadmap'])->name('lessons.roadmap');
    Route::get('lessons/{levelCode}/{dayNumber}', [DayController::class, 'show'])->whereNumber('dayNumber')->name('lessons.day');
    Route::post('lessons/{levelCode}/{dayNumber}/complete', [DayController::class, 'completeSkill'])->whereNumber('dayNumber')->name('lessons.complete');
    Route::get('lessons/{levelCode}/{dayNumber}/vocab', [VocabController::class, 'show'])->whereNumber('dayNumber')->name('lessons.vocab');
    Route::get('lessons/{levelCode}/{dayNumber}/listening', [ListeningController::class, 'show'])->whereNumber('dayNumber')->name('lessons.listening');
    Route::get('lessons/{levelCode}/{dayNumber}/reading', [ReadingController::class, 'show'])->whereNumber('dayNumber')->name('lessons.reading');
    Route::get('lessons/{levelCode}/{dayNumber}/speaking', [SpeakingController::class, 'show'])->whereNumber('dayNumber')->name('lessons.speaking');

    Route::inertia('videos', 'learn/videos/index')->name('videos');
    Route::get('rewards', [RewardController::class, 'index'])->name('rewards');
    Route::get('progress', [ProgressController::class, 'index'])->name('progress');
    Route::inertia('profile', 'learn/profile/index')->name('profile');
});
