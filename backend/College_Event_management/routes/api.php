<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\StudentController;
use App\Http\Controllers\Api\Admin\CoordinatorController;
use App\Http\Controllers\Api\Admin\EventCategoryController;
use App\Http\Controllers\Api\Admin\EventController;
use App\Http\Controllers\Api\Admin\RegistrationController;
use App\Http\Controllers\Api\Admin\AttendanceController;
use App\Http\Controllers\Api\Admin\ResultController;
use App\Http\Controllers\Api\Admin\AnnouncementController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\ProfileController;
use App\Http\Controllers\Api\Coordinator\CoordinatorAuthController;
use App\Http\Controllers\Api\Coordinator\CoordinatorEventController;

// Public Route
Route::post('/admin/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/admin/logout', [AuthController::class, 'logout']);

    Route::apiResource('students', StudentController::class);

    Route::apiResource('coordinators', CoordinatorController::class);

    Route::apiResource('event-categories', EventCategoryController::class);

    Route::apiResource('events', EventController::class);

    Route::apiResource('registrations', RegistrationController::class);

    Route::apiResource('attendances', AttendanceController::class);

    Route::apiResource('results', ResultController::class);

    Route::apiResource('announcements', AnnouncementController::class);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::apiResource('events', EventController::class);

Route::put('events/{id}/approve', [EventController::class, 'approve']);

Route::put('events/{id}/reject', [EventController::class, 'reject']);

Route::get('/registrations', [RegistrationController::class, 'index']);
Route::get('/registrations/{id}', [RegistrationController::class, 'show']);

 Route::get('/profile', [ProfileController::class, 'profile']);
 Route::put('/profile', [ProfileController::class, 'updateProfile']);

  Route::get('/profile', [ProfileController::class, 'profile']);

    Route::put('/profile', [ProfileController::class, 'updateProfile']);

    Route::put('/profile/change-password', [ProfileController::class, 'changePassword']);


});

Route::prefix('coordinator')->group(function () {

    // Authentication
    Route::post('/login', [CoordinatorAuthController::class, 'login']);
    Route::post('/logout', [CoordinatorAuthController::class, 'logout']);
    Route::get('/profile', [CoordinatorAuthController::class, 'profile']);

    // Events
    Route::get('/events', [EventController::class, 'index']);
    Route::post('/events', [EventController::class, 'store']);
    Route::get('/events/{id}', [EventController::class, 'show']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);

     Route::middleware('auth:coordinator')
    ->prefix('coordinator')
    ->group(function () {

        // View only logged-in coordinator's events
        Route::get('/events',
            [CoordinatorEventController::class, 'index']);

        // Add new event
        Route::post('/events',
            [CoordinatorEventController::class, 'store']);

        // View single own event
        Route::get('/events/{id}',
            [CoordinatorEventController::class, 'show']);

        // Edit own event
        Route::put('/events/{id}',
            [CoordinatorEventController::class, 'update']);

        // Delete own event
        Route::delete('/events/{id}',
            [CoordinatorEventController::class, 'destroy']);

    });
});
