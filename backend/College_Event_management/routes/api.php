<?php

use Illuminate\Support\Facades\Route;

// =====================================================
// ADMIN CONTROLLERS
// =====================================================

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

// =====================================================
// COORDINATOR CONTROLLERS
// =====================================================

use App\Http\Controllers\Api\Coordinator\CoordinatorAuthController;
use App\Http\Controllers\Api\Coordinator\CoordinatorDashboardController;
use App\Http\Controllers\Api\Coordinator\CoordinatorEventController;
use App\Http\Controllers\Api\Coordinator\CoordinatorRegistrationController;
use App\Http\Controllers\Api\Coordinator\CoordinatorAttendanceController;
use App\Http\Controllers\Api\Coordinator\CoordinatorResultController;
use App\Http\Controllers\Api\Coordinator\CoordinatorAnnouncementController;
// =====================================================
// ADMIN LOGIN
// =====================================================

Route::post('/admin/login', [AuthController::class, 'login']);


// =====================================================
// EVENT CATEGORIES - VIEW
// =====================================================

// Admin and Coordinator can VIEW categories
Route::get(
    '/event-categories',
    [EventCategoryController::class, 'index']
);


// =====================================================
// ADMIN PROTECTED ROUTES
// =====================================================

Route::middleware('auth:sanctum')->group(function () {

    // =================================================
    // ADMIN AUTHENTICATION
    // =================================================

    Route::post(
        '/admin/logout',
        [AuthController::class, 'logout']
    );


    // =================================================
    // STUDENTS
    // =================================================

    Route::apiResource(
        'students',
        StudentController::class
    );


    // =================================================
    // COORDINATORS
    // =================================================

    Route::apiResource(
        'coordinators',
        CoordinatorController::class
    );


    // =================================================
    // EVENT CATEGORIES - ADMIN MANAGEMENT
    // =================================================

    Route::post(
        '/event-categories',
        [EventCategoryController::class, 'store']
    );

    Route::get(
        '/event-categories/{event_category}',
        [EventCategoryController::class, 'show']
    );

    Route::put(
        '/event-categories/{event_category}',
        [EventCategoryController::class, 'update']
    );

    Route::delete(
        '/event-categories/{event_category}',
        [EventCategoryController::class, 'destroy']
    );


    // =================================================
    // EVENTS - ADMIN
    // =================================================

    Route::apiResource(
        'events',
        EventController::class
    );

    // Approve Event
    Route::put(
        '/events/{id}/approve',
        [EventController::class, 'approve']
    );

    // Reject Event
    Route::put(
        '/events/{id}/reject',
        [EventController::class, 'reject']
    );


    // =================================================
    // REGISTRATIONS
    // =================================================

    Route::apiResource(
        'registrations',
        RegistrationController::class
    );


    // =================================================
    // ATTENDANCES
    // =================================================

    Route::apiResource(
        'attendances',
        AttendanceController::class
    );


    // =================================================
    // RESULTS
    // =================================================

    Route::apiResource(
        'results',
        ResultController::class
    );


    // =================================================
    // ANNOUNCEMENTS
    // =================================================

    Route::apiResource(
        'announcements',
        AnnouncementController::class
    );


    // =================================================
    // ADMIN DASHBOARD
    // =================================================

    Route::get(
        '/dashboard',
        [DashboardController::class, 'index']
    );


    // =================================================
    // ADMIN PROFILE
    // =================================================

    Route::get(
        '/profile',
        [ProfileController::class, 'profile']
    );

    Route::put(
        '/profile',
        [ProfileController::class, 'updateProfile']
    );

    Route::put(
        '/profile/change-password',
        [ProfileController::class, 'changePassword']
    );

});


// =====================================================
// COORDINATOR ROUTES
// =====================================================

Route::prefix('coordinator')->group(function () {

    // =================================================
    // COORDINATOR AUTHENTICATION
    // =================================================

    Route::post(
        '/login',
        [CoordinatorAuthController::class, 'login']
    );

    Route::post(
        '/logout',
        [CoordinatorAuthController::class, 'logout']
    );

    Route::get(
        '/profile',
        [CoordinatorAuthController::class, 'profile']
    );

Route::get(
    '/dashboard',
    [CoordinatorDashboardController::class, 'index']
);
    // =================================================
    // COORDINATOR EVENT MANAGEMENT
    // =================================================

    Route::middleware('auth:coordinator')->group(function () {

        // View ONLY logged-in coordinator's events
        Route::get(
            '/events',
            [CoordinatorEventController::class, 'index']
        );

        // Create event
        Route::post(
            '/events',
            [CoordinatorEventController::class, 'store']
        );

        // View ONLY own event
        Route::get(
            '/events/{id}',
            [CoordinatorEventController::class, 'show']
        );

        // Edit ONLY own event
        Route::put(
            '/events/{id}',
            [CoordinatorEventController::class, 'update']
        );

        // Delete ONLY own event
        Route::delete(
            '/events/{id}',
            [CoordinatorEventController::class, 'destroy']
        );

// =====================================================
// COORDINATOR REGISTRATIONS
// =====================================================

Route::get(
    '/registrations',
    [CoordinatorRegistrationController::class, 'index']
);

Route::get(
    '/registrations/{id}',
    [CoordinatorRegistrationController::class, 'show']
);

Route::put(
    '/registrations/{id}/approve',
    [CoordinatorRegistrationController::class, 'approve']
);

Route::put(
    '/registrations/{id}/reject',
    [CoordinatorRegistrationController::class, 'reject']
);

Route::get(
            '/attendance',
            [CoordinatorAttendanceController::class, 'index']
        );

        Route::get(
            '/attendance/event/{eventId}',
            [CoordinatorAttendanceController::class, 'eventParticipants']
        );

        Route::post(
            '/attendance',
            [CoordinatorAttendanceController::class, 'store']
        );

        Route::get(
            '/attendance/{id}',
            [CoordinatorAttendanceController::class, 'show']
        );

        Route::delete(
            '/attendance/{id}',
            [CoordinatorAttendanceController::class, 'destroy']
        );

        Route::get(
            '/results',
            [CoordinatorResultController::class, 'index']
        );

        Route::get(
            '/results/events',
            [CoordinatorResultController::class, 'events']
        );

        Route::get(
            '/results/event/{eventId}/participants',
            [CoordinatorResultController::class, 'participants']
        );

        Route::post(
            '/results',
            [CoordinatorResultController::class, 'store']
        );

        Route::put(
            '/results/{id}',
            [CoordinatorResultController::class, 'update']
        );

        Route::delete(
            '/results/{id}',
            [CoordinatorResultController::class, 'destroy']
        );




        Route::get('/announcements', [
        CoordinatorAnnouncementController::class,
        'index'
    ]);

    Route::post('/announcements', [
        CoordinatorAnnouncementController::class,
        'store'
    ]);

    Route::get('/announcements/{id}', [
        CoordinatorAnnouncementController::class,
        'show'
    ]);

    Route::delete('/announcements/{id}', [
        CoordinatorAnnouncementController::class,
        'destroy'
    ]);


     // Profile
        Route::get('/profile', [
            CoordinatorAuthController::class,
            'profile'
        ]);

        // Update password
        Route::put('/password', [
            CoordinatorAuthController::class,
            'updatePassword'
        ]);

        // Forgot Password
Route::post('/forgot-password', [
    CoordinatorAuthController::class,
    'forgotPassword'
]);

// Verify OTP
Route::post('/verify-reset-otp', [
    CoordinatorAuthController::class,
    'verifyResetOtp'
]);

// Reset Password
Route::post('/reset-password', [
    CoordinatorAuthController::class,
    'resetPassword'
]);

    });

});