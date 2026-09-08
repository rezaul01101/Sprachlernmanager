<?php

use App\Http\Controllers\Admin\DayController;
use App\Http\Controllers\Admin\LevelController;
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
    Route::get('levels/{level}/days', [DayController::class, 'index'])->name('levels.days.index');
    Route::get('levels/{level}/days/create', [DayController::class, 'create'])->name('levels.days.create');
    Route::post('levels/{level}/days', [DayController::class, 'store'])->name('levels.days.store');
    Route::get('levels/{level}/days/{day}/edit', [DayController::class, 'edit'])->name('levels.days.edit');
    Route::put('levels/{level}/days/{day}', [DayController::class, 'update'])->name('levels.days.update');
    Route::delete('levels/{level}/days/{day}', [DayController::class, 'destroy'])->name('levels.days.destroy');
});
