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

        if (!$student) {
            return response()->json([
                'message' => 'Student not authenticated.'
            ], 401);
        }

        /*
        |--------------------------------------------------------------------------
        | EVENT VISIBILITY RULE
        |--------------------------------------------------------------------------
        |
        | Show event when:
        |
        | 1. Event status is Approved
        | 2. Event date is in the future
        |
        | OR
        |
        | 3. Event date is today
        | 4. Current time is before or equal to end_time
        |
        */

        $events = Event::with([
                'category',
                'coordinator'
            ])
            ->where('status', 'Approved')

            ->where(function ($query) {

                // Future events
                $query->whereDate(
                    'event_date',
                    '>',
                    today()
                )

                // Today's events which have not ended
                ->orWhere(function ($query) {

                    $query->whereDate(
                        'event_date',
                        today()
                    )
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

                /*
                |--------------------------------------------------------------------------
                | CHECK STUDENT REGISTRATION
                |--------------------------------------------------------------------------
                */

                $registration = Registration::where(
                        'student_id',
                        $student->id
                    )
                    ->where(
                        'event_id',
                        $event->id
                    )
                    ->first();


                return [
                    'id' => $event->id,

                    'event_name' => $event->event_name,

                    'description' => $event->description,


                    // =====================================================
                    // EVENT IMAGE
                    // =====================================================

                    'image' => $event->image
                        ? asset('storage/' . $event->image)
                        : null,


                    // =====================================================
                    // EVENT INFORMATION
                    // =====================================================

                    'venue' => $event->venue,

                    'event_date' => $event->event_date,

                    'start_time' => $event->start_time,

                    'end_time' => $event->end_time,

                    'max_participants' => $event->max_participants,

                    'status' => $event->status,


                    // =====================================================
                    // CATEGORY & COORDINATOR
                    // =====================================================

                    'category' => $event->category,

                    'coordinator' => $event->coordinator,


                    // =====================================================
                    // STUDENT REGISTRATION
                    // =====================================================

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

        if (!$student) {
            return response()->json([
                'message' => 'Student not authenticated.'
            ], 401);
        }


        /*
        |--------------------------------------------------------------------------
        | ONLY SHOW APPROVED AND ACTIVE EVENTS
        |--------------------------------------------------------------------------
        */

        $event = Event::with([
                'category',
                'coordinator'
            ])
            ->where('status', 'Approved')

            ->where(function ($query) {

                // Future events
                $query->whereDate(
                    'event_date',
                    '>',
                    today()
                )

                // Today's events which have not ended
                ->orWhere(function ($query) {

                    $query->whereDate(
                        'event_date',
                        today()
                    )
                    ->whereTime(
                        'end_time',
                        '>=',
                        now()->format('H:i:s')
                    );

                });

            })

            ->findOrFail($id);


        /*
        |--------------------------------------------------------------------------
        | CHECK STUDENT REGISTRATION
        |--------------------------------------------------------------------------
        */

        $registration = Registration::where(
                'student_id',
                $student->id
            )
            ->where(
                'event_id',
                $event->id
            )
            ->first();


        return response()->json([

            'event' => [

                'id' => $event->id,

                'event_name' => $event->event_name,

                'description' => $event->description,


                // =====================================================
                // EVENT IMAGE
                // =====================================================

                'image' => $event->image
                    ? asset('storage/' . $event->image)
                    : null,


                // =====================================================
                // EVENT INFORMATION
                // =====================================================

                'venue' => $event->venue,

                'event_date' => $event->event_date,

                'start_time' => $event->start_time,

                'end_time' => $event->end_time,

                'max_participants' => $event->max_participants,

                'status' => $event->status,


                // =====================================================
                // CATEGORY & COORDINATOR
                // =====================================================

                'category' => $event->category,

                'coordinator' => $event->coordinator,


                // =====================================================
                // STUDENT REGISTRATION
                // =====================================================

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


        /*
        |--------------------------------------------------------------------------
        | ONLY APPROVED AND ACTIVE EVENTS CAN BE REGISTERED
        |--------------------------------------------------------------------------
        */

        $event = Event::where(
                'status',
                'Approved'
            )

            ->where(function ($query) {

                // Future events
                $query->whereDate(
                    'event_date',
                    '>',
                    today()
                )

                // Today's events which have not ended
                ->orWhere(function ($query) {

                    $query->whereDate(
                        'event_date',
                        today()
                    )
                    ->whereTime(
                        'end_time',
                        '>=',
                        now()->format('H:i:s')
                    );

                });

            })

            ->findOrFail($id);


        /*
        |--------------------------------------------------------------------------
        | CHECK EXISTING REGISTRATION
        |--------------------------------------------------------------------------
        */

        $existingRegistration = Registration::where(
                'student_id',
                $student->id
            )
            ->where(
                'event_id',
                $event->id
            )
            ->first();


        if ($existingRegistration) {

            // =====================================================
            // PENDING
            // =====================================================

            if ($existingRegistration->status === 'Pending') {

                return response()->json([
                    'message' =>
                        'Your registration request is already pending approval.'
                ], 422);
            }


            // =====================================================
            // APPROVED
            // =====================================================

            if ($existingRegistration->status === 'Approved') {

                return response()->json([
                    'message' =>
                        'You are already approved for this event.'
                ], 422);
            }


            // =====================================================
            // REJECTED
            // =====================================================

            if ($existingRegistration->status === 'Rejected') {

                return response()->json([
                    'message' =>
                        'Your registration request was rejected.'
                ], 422);
            }
        }


        /*
        |--------------------------------------------------------------------------
        | CHECK MAXIMUM PARTICIPANTS
        |--------------------------------------------------------------------------
        */

        if ($event->max_participants) {

            $approvedCount = Registration::where(
                    'event_id',
                    $event->id
                )
                ->where(
                    'status',
                    'Approved'
                )
                ->count();


            if (
                $approvedCount >=
                $event->max_participants
            ) {

                return response()->json([
                    'message' =>
                        'This event is full.'
                ], 422);
            }
        }


        /*
        |--------------------------------------------------------------------------
        | CREATE REGISTRATION
        |--------------------------------------------------------------------------
        |
        | New registration always starts as Pending.
        |
        */

        $registration = Registration::create([

            'student_id' =>
                $student->id,

            'event_id' =>
                $event->id,

            'registration_date' =>
                now()->toDateString(),

            'status' =>
                'Pending',
        ]);


        /*
        |--------------------------------------------------------------------------
        | SUCCESS RESPONSE
        |--------------------------------------------------------------------------
        */

        return response()->json([

            'message' =>
                'Event registration request submitted successfully. Waiting for coordinator approval.',

            'registration' =>
                $registration

        ], 201);
    }
}