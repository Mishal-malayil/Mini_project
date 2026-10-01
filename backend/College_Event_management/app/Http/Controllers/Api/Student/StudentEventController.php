<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Registration;
use Illuminate\Http\Request;

class StudentEventController extends Controller
{
    // =====================================================
    // GET AVAILABLE EVENTS FOR STUDENTS
    // =====================================================

    public function index(Request $request)
    {
        $student = $request->user();

        $events = Event::with(['category', 'coordinator'])
            ->where('status', 'Approved')
            ->orderBy('event_date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get()
            ->map(function ($event) use ($student) {

                $registration = Registration::where('student_id', $student->id)
                    ->where('event_id', $event->id)
                    ->first();

                return [
                    'id' => $event->id,
                    'event_name' => $event->event_name,
                    'description' => $event->description,

                    // EVENT IMAGE
                    'image' => $event->image
                        ? asset('storage/' . $event->image)
                        : null,

                    'venue' => $event->venue,
                    'event_date' => $event->event_date,
                    'start_time' => $event->start_time,
                    'end_time' => $event->end_time,
                    'max_participants' => $event->max_participants,
                    'status' => $event->status,

                    'category' => $event->category,
                    'coordinator' => $event->coordinator,

                    'is_registered' => $registration !== null,
                    'registration_status' => $registration?->status,
                ];
            });

        return response()->json([
            'events' => $events
        ]);
    }


    // =====================================================
    // GET SINGLE EVENT DETAILS
    // =====================================================

    public function show(Request $request, $id)
    {
        $student = $request->user();

        $event = Event::with(['category', 'coordinator'])
            ->where('status', 'Approved')
            ->findOrFail($id);

        $registration = Registration::where('student_id', $student->id)
            ->where('event_id', $event->id)
            ->first();

        return response()->json([
            'event' => [
                'id' => $event->id,
                'event_name' => $event->event_name,
                'description' => $event->description,

                // EVENT IMAGE
                'image' => $event->image
                    ? asset('storage/' . $event->image)
                    : null,

                'venue' => $event->venue,
                'event_date' => $event->event_date,
                'start_time' => $event->start_time,
                'end_time' => $event->end_time,
                'max_participants' => $event->max_participants,
                'status' => $event->status,

                'category' => $event->category,
                'coordinator' => $event->coordinator,

                'is_registered' => $registration !== null,
                'registration_status' => $registration?->status,
            ]
        ]);
    }


    

// =====================================================
// REGISTER LOGGED-IN STUDENT FOR EVENT
// =====================================================

public function register(Request $request, $id)
{
    $student = $request->user();

    if (!$student) {
        return response()->json([
            'message' => 'Student not authenticated.'
        ], 401);
    }

    // Only approved events can be registered
    $event = Event::where('status', 'Approved')
        ->findOrFail($id);

    // Check existing registration
    $existingRegistration = Registration::where('student_id', $student->id)
        ->where('event_id', $event->id)
        ->first();

    if ($existingRegistration) {

        if ($existingRegistration->status === 'Pending') {
            return response()->json([
                'message' => 'Your registration request is already pending approval.'
            ], 422);
        }

        if ($existingRegistration->status === 'Approved') {
            return response()->json([
                'message' => 'You are already approved for this event.'
            ], 422);
        }

        if ($existingRegistration->status === 'Rejected') {
            return response()->json([
                'message' => 'Your registration request was rejected.'
            ], 422);
        }
    }

    // Check maximum participants
    if ($event->max_participants) {

        $approvedCount = Registration::where('event_id', $event->id)
            ->where('status', 'Approved')
            ->count();

        if ($approvedCount >= $event->max_participants) {
            return response()->json([
                'message' => 'This event is full.'
            ], 422);
        }
    }

    // Create registration as Pending
    $registration = Registration::create([
        'student_id' => $student->id,
        'event_id' => $event->id,
        'registration_date' => now()->toDateString(),
        'status' => 'Pending',
    ]);

    return response()->json([
        'message' => 'Event registration request submitted successfully. Waiting for coordinator approval.',
        'registration' => $registration
    ], 201);
}
}