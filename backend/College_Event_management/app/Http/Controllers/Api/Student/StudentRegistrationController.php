<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Registration;
use Illuminate\Http\Request;

class StudentRegistrationController extends Controller
{
    public function index(Request $request)
    {
        $student = $request->user();

        if (!$student) {
            return response()->json([
                'message' => 'Student not authenticated.'
            ], 401);
        }

        $registrations = Registration::with([
            'event.category',
            'event.coordinator'
        ])
        ->where('student_id', $student->id)
        ->latest()
        ->get()
        ->map(function ($registration) {

            $event = $registration->event;

            return [
                'id' => $registration->id,

                'event_id' => $event->id,

                'event_name' => $event->event_name,

                'description' => $event->description,

                'image' => $event->image
                    ? asset('storage/' . $event->image)
                    : null,

                'venue' => $event->venue,

                'event_date' => $event->event_date,

                'start_time' => $event->start_time,

                'end_time' => $event->end_time,

                'registration_date' =>
                    $registration->registration_date,

                'status' =>
                    $registration->status,

                'category' =>
                    $event->category,

                'coordinator' =>
                    $event->coordinator,
            ];
        });

        return response()->json([
            'registrations' => $registrations
        ]);
    }
    
    public function destroy(Request $request, $id)
{
    $student = $request->user();

    if (!$student) {
        return response()->json([
            'message' => 'Student not authenticated.'
        ], 401);
    }

    $registration = Registration::where('id', $id)
        ->where('student_id', $student->id)
        ->first();

    if (!$registration) {
        return response()->json([
            'message' => 'Registration not found.'
        ], 404);
    }

    // Optional: don't allow deletion after approval
    if ($registration->status === 'Approved') {
        return response()->json([
            'message' => 'Approved registrations cannot be cancelled.'
        ], 422);
    }

    $registration->delete();

    return response()->json([
        'message' => 'Registration cancelled successfully.'
    ], 200);
}
}