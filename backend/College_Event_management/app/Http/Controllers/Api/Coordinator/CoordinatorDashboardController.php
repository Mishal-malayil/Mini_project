<?php

namespace App\Http\Controllers\Api\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Registration;
use App\Models\Attendance;
use App\Models\Result;

class CoordinatorDashboardController extends Controller
{
    /**
     * Display coordinator dashboard statistics.
     */
    public function index()
    {
        // Get the currently logged-in coordinator
        $coordinator = auth('coordinator')->user();

        // Check authentication
        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        // Total events assigned to this coordinator
        $totalEvents = Event::where(
            'coordinator_id',
            $coordinator->id
        )->count();

        // Total registrations for this coordinator's events
        $totalRegistrations = Registration::whereHas(
            'event',
            function ($query) use ($coordinator) {
                $query->where(
                    'coordinator_id',
                    $coordinator->id
                );
            }
        )->count();

        // Total attendance records for this coordinator's events
        $totalAttendance = Attendance::whereHas(
            'registration.event',
            function ($query) use ($coordinator) {
                $query->where(
                    'coordinator_id',
                    $coordinator->id
                );
            }
        )->count();

        // Total results for this coordinator's events
        $totalResults = Result::whereHas(
            'event',
            function ($query) use ($coordinator) {
                $query->where(
                    'coordinator_id',
                    $coordinator->id
                );
            }
        )->count();

        // Return dashboard statistics
        return response()->json([
            'total_events' => $totalEvents,
            'total_registrations' => $totalRegistrations,
            'total_attendance' => $totalAttendance,
            'total_results' => $totalResults
        ], 200);
    }
}