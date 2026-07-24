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

});