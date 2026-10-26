<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentEventController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET AVAILABLE EVENTS FOR STUDENTS
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {
        $student = $request->user();

        if (!$student) {
            return response()->json([
                'message' => 'Student not authenticated.'
            ], 401);
        }

        $events = Event::with([
                'category',
                'coordinator'
            ])
            ->where('status', 'Approved')
            ->where(function ($query) {
                $query->whereDate('event_date', '>', today())
                    ->orWhere(function ($query) {
                        $query->whereDate('event_date', today())
                            ->whereTime(
                                'end_time',
                                '>=',
                                now()->format('H:i:s')
                            );
                    });
            })
            ->orderBy('event_date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get()
            ->map(function ($event) use ($student) {

                $registration = Registration::where(
                        'student_id',
                        $student->id
                    )
                    ->where('event_id', $event->id)
                    ->first();

                $registeredCount = Registration::where(
                        'event_id',
                        $event->id
                    )
                    ->whereIn('status', ['Pending', 'Approved'])
                    ->count();

                return [
                    'id' => $event->id,
                    'event_name' => $event->event_name,
                    'description' => $event->description,

                    'image' => $event->image
                        ? asset('storage/' . $event->image)
                        : null,

                    'venue' => $event->venue,
                    'event_date' => $event->event_date,
                    'start_time' => $event->start_time,
                    'end_time' => $event->end_time,

                    'max_participants' => $event->max_participants,
                    'registered_count' => $registeredCount,

                    'available_seats' => $event->max_participants !== null
                        ? max(
                            0,
                            $event->max_participants - $registeredCount
                        )
                        : null,

                    'is_full' => $event->max_participants !== null
                        && $registeredCount >= $event->max_participants,

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


    /*
    |--------------------------------------------------------------------------
    | GET SINGLE EVENT DETAILS
    |--------------------------------------------------------------------------
    */

    public function show(Request $request, $id)
    {
        $student = $request->user();

        if (!$student) {
            return response()->json([
                'message' => 'Student not authenticated.'
            ], 401);
        }

        $event = Event::with([
                'category',
                'coordinator'
            ])
            ->where('status', 'Approved')
            ->where(function ($query) {
                $query->whereDate('event_date', '>', today())
                    ->orWhere(function ($query) {
                        $query->whereDate('event_date', today())
                            ->whereTime(
                                'end_time',
                                '>=',
                                now()->format('H:i:s')
                            );
                    });
            })
            ->findOrFail($id);

        $registration = Registration::where(
                'student_id',
                $student->id
            )
            ->where('event_id', $event->id)
            ->first();

        $registeredCount = Registration::where(
                'event_id',
                $event->id
            )
            ->whereIn('status', ['Pending', 'Approved'])
            ->count();

        return response()->json([
            'event' => [
                'id' => $event->id,
                'event_name' => $event->event_name,
                'description' => $event->description,

                'image' => $event->image
                    ? asset('storage/' . $event->image)
                    : null,

                'venue' => $event->venue,
                'event_date' => $event->event_date,
                'start_time' => $event->start_time,
                'end_time' => $event->end_time,

                'max_participants' => $event->max_participants,
                'registered_count' => $registeredCount,

                'available_seats' => $event->max_participants !== null
                    ? max(
                        0,
                        $event->max_participants - $registeredCount
                    )
                    : null,

                'is_full' => $event->max_participants !== null
                    && $registeredCount >= $event->max_participants,

                'status' => $event->status,
                'category' => $event->category,
                'coordinator' => $event->coordinator,

                'is_registered' => $registration !== null,
                'registration_status' => $registration?->status,
            ]
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | REGISTER LOGGED-IN STUDENT FOR EVENT
    |--------------------------------------------------------------------------
    */

    public function register(Request $request, $id)
    {
        $student = $request->user();

        if (!$student) {
            return response()->json([
                'message' => 'Student not authenticated.'
            ], 401);
        }

        return DB::transaction(function () use ($student, $id) {

            /*
            |--------------------------------------------------------------------------
            | FIND AND LOCK EVENT
            |--------------------------------------------------------------------------
            */

            $event = Event::where('status', 'Approved')
                ->where(function ($query) {
                    $query->whereDate('event_date', '>', today())
                        ->orWhere(function ($query) {
                            $query->whereDate('event_date', today())
                                ->whereTime(
                                    'end_time',
                                    '>=',
                                    now()->format('H:i:s')
                                );
                        });
                })
                ->where('id', $id)
                ->lockForUpdate()
                ->first();

            if (!$event) {
                return response()->json([
                    'message' =>
                        'This event is unavailable, not approved, or has already ended.'
                ], 404);
            }


            /*
            |--------------------------------------------------------------------------
            | CHECK EXISTING REGISTRATION
            |--------------------------------------------------------------------------
            */

            $existingRegistration = Registration::where(
                    'student_id',
                    $student->id
                )
                ->where('event_id', $event->id)
                ->first();

            if ($existingRegistration) {

                if ($existingRegistration->status === 'Pending') {
                    return response()->json([
                        'message' =>
                            'Your registration request is already pending approval.'
                    ], 422);
                }

                if ($existingRegistration->status === 'Approved') {
                    return response()->json([
                        'message' =>
                            'You are already approved for this event.'
                    ], 422);
                }

                if ($existingRegistration->status === 'Rejected') {
                    return response()->json([
                        'message' =>
                            'Your registration request was rejected.'
                    ], 422);
                }

                return response()->json([
                    'message' =>
                        'A registration record already exists for this event.'
                ], 422);
            }


            /*
            |--------------------------------------------------------------------------
            | CHECK MAXIMUM PARTICIPANTS
            |--------------------------------------------------------------------------
            |
            | Pending and Approved registrations count toward the limit.
            | Rejected registrations do not count.
            | A null maximum means unlimited registrations.
            |
            */

            $registeredCount = Registration::where(
                    'event_id',
                    $event->id
                )
                ->whereIn('status', ['Pending', 'Approved'])
                ->count();

            if (
                $event->max_participants !== null
                && $registeredCount >= $event->max_participants
            ) {
                return response()->json([
                    'message' =>
                        'This event has reached its maximum participant limit.',
                    'max_participants' => $event->max_participants,
                    'registered_count' => $registeredCount,
                    'available_seats' => 0,
                ], 422);
            }


            /*
            |--------------------------------------------------------------------------
            | CREATE REGISTRATION
            |--------------------------------------------------------------------------
            |
            | New registration starts with Pending status.
            |
            */

            $registration = Registration::create([
                'student_id' => $student->id,
                'event_id' => $event->id,
                'registration_date' => now()->toDateString(),
                'status' => 'Pending',
            ]);


            /*
            |--------------------------------------------------------------------------
            | SUCCESS RESPONSE
            |--------------------------------------------------------------------------
            */

            $newRegisteredCount = $registeredCount + 1;

            return response()->json([
                'message' =>
                    'Event registration request submitted successfully. Waiting for coordinator approval.',

                'registration' => $registration,

                'max_participants' => $event->max_participants,
                'registered_count' => $newRegisteredCount,

                'available_seats' => $event->max_participants !== null
                    ? max(
                        0,
                        $event->max_participants - $newRegisteredCount
                    )
                    : null,
            ], 201);
        });
    }
}
