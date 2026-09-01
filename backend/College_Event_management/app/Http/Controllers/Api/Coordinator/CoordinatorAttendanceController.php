<?php

namespace App\Http\Controllers\Api\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Registration;
use Illuminate\Http\Request;

class CoordinatorAttendanceController extends Controller
{
    // =====================================================
    // GET ATTENDANCE FOR COORDINATOR'S OWN EVENTS
    // =====================================================

    public function index()
    {
        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        $attendances = Attendance::with([
            'registration.student',
            'registration.event'
        ])
        ->whereHas('registration.event', function ($query) use ($coordinator) {

            $query->where(
                'coordinator_id',
                $coordinator->id
            );

        })
        ->latest()
        ->get();

        return response()->json($attendances);
    }


    // =====================================================
    // GET APPROVED PARTICIPANTS FOR ONE EVENT
    // =====================================================

    public function eventParticipants($eventId)
    {
        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }


        // Check event belongs to coordinator
        $eventExists = \App\Models\Event::where('id', $eventId)
            ->where('coordinator_id', $coordinator->id)
            ->exists();

        if (!$eventExists) {
            return response()->json([
                'message' => 'Event not found or not assigned to this coordinator'
            ], 404);
        }


        // Get approved registrations
        $registrations = Registration::with([
            'student',
            'event',
            'attendances'
        ])
        ->where('event_id', $eventId)
        ->where('status', 'Approved')
        ->get();

        return response()->json($registrations);
    }


    // =====================================================
    // MARK ATTENDANCE
    // =====================================================

    public function store(Request $request)
    {
        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }


        $validated = $request->validate([
            'registration_id' => 'required|exists:registrations,id',
            'attendance_date' => 'required|date',
            'status' => 'required|in:Present,Absent'
        ]);


        // Make sure registration belongs to coordinator's event
        $registration = Registration::where(
            'id',
            $validated['registration_id']
        )
        ->where('status', 'Approved')
        ->whereHas('event', function ($query) use ($coordinator) {

            $query->where(
                'coordinator_id',
                $coordinator->id
            );

        })
        ->first();


        if (!$registration) {
            return response()->json([
                'message' =>
                    'Registration not found or you are not authorized to mark attendance'
            ], 404);
        }


        // Prevent duplicate attendance for same registration/date
        $existingAttendance = Attendance::where(
            'registration_id',
            $registration->id
        )
        ->where(
            'attendance_date',
            $validated['attendance_date']
        )
        ->first();


        if ($existingAttendance) {

            $existingAttendance->update([
                'status' => $validated['status']
            ]);

            return response()->json([
                'message' => 'Attendance updated successfully',
                'attendance' => $existingAttendance
            ]);

        }


        $attendance = Attendance::create([
            'registration_id' =>
                $registration->id,

            'attendance_date' =>
                $validated['attendance_date'],

            'status' =>
                $validated['status']
        ]);


        return response()->json([
            'message' => 'Attendance marked successfully',
            'attendance' => $attendance
        ], 201);
    }


    // =====================================================
    // VIEW ONE ATTENDANCE
    // =====================================================

    public function show($id)
    {
        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }


        $attendance = Attendance::with([
            'registration.student',
            'registration.event'
        ])
        ->where('id', $id)
        ->whereHas('registration.event', function ($query) use ($coordinator) {

            $query->where(
                'coordinator_id',
                $coordinator->id
            );

        })
        ->first();


        if (!$attendance) {
            return response()->json([
                'message' => 'Attendance not found'
            ], 404);
        }


        return response()->json($attendance);
    }


    // =====================================================
    // DELETE ATTENDANCE
    // =====================================================

    public function destroy($id)
    {
        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }


        $attendance = Attendance::where('id', $id)
            ->whereHas('registration.event', function ($query) use ($coordinator) {

                $query->where(
                    'coordinator_id',
                    $coordinator->id
                );

            })
            ->first();


        if (!$attendance) {
            return response()->json([
                'message' => 'Attendance not found'
            ], 404);
        }


        $attendance->delete();


        return response()->json([
            'message' => 'Attendance deleted successfully'
        ]);
    }
}