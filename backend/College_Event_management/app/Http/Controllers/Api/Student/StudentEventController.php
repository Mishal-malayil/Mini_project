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

        $event = Event::where('status', 'Approved')
            ->findOrFail($id);

        // Check if already registered
        $existingRegistration = Registration::where('student_id', $student->id)
            ->where('event_id', $event->id)
            ->first();

        if ($existingRegistration) {
            return response()->json([
                'message' => 'You are already registered for this event.'
            ], 422);
        }

        // Check maximum participants
        if ($event->max_participants) {

            $registeredCount = Registration::where('event_id', $event->id)
                ->where('status', 'Registered')
                ->count();

            if ($registeredCount >= $event->max_participants) {
                return response()->json([
                    'message' => 'This event is full.'
                ], 422);
            }
        }

        $registration = Registration::create([
            'student_id' => $student->id,
            'event_id' => $event->id,
            'registration_date' => now()->toDateString(),
            'status' => 'Registered',
        ]);

        return response()->json([
            'message' => 'Event registration successful.',
            'registration' => $registration
        ], 201);
    }
}