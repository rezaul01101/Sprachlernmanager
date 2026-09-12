<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DayController;
use App\Http\Controllers\Api\LevelController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'time' => now()->toIso8601String(),
    ]);
});

Route::prefix('v1')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:api-auth');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:api-auth');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        Route::get('/levels', [LevelController::class, 'index']);
        Route::post('/levels/{code}/enroll', [LevelController::class, 'enroll']);
        Route::get('/levels/{code}/days', [LevelController::class, 'days']);
        Route::get('/levels/{code}/days/{dayNumber}', [DayController::class, 'show'])->whereNumber('dayNumber');
        Route::post('/levels/{code}/days/{dayNumber}/complete', [DayController::class, 'completeSkill'])->whereNumber('dayNumber');
    });
});
