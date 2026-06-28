<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\AnimalController;

Route::prefix('')->group(function () {
    Route::post('/auth/login-google', [AuthController::class, 'loginGoogle']);
    Route::post('/animals/find', [AnimalController::class, 'findAnimal']);

    Route::middleware('auth.jwt')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::get('/users/{id}/animals', [UserController::class, 'getUserAnimals']);

        Route::get('/animals/profiles', [AnimalController::class, 'index']);
        Route::get('/animals/{id}/profile', [AnimalController::class, 'show']);
        Route::get('/animals/{id}/todos', [AnimalController::class, 'todos']);
        Route::put('/animals/todos/{id}', [AnimalController::class, 'updateTodo']);
        Route::put('/animals', [AnimalController::class, 'update']);
    });
});
