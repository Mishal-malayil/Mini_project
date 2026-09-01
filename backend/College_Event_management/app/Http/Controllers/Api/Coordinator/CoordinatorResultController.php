<?php

namespace App\Http\Controllers\Api\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\Result;
use App\Models\Event;
use App\Models\Student;
use Illuminate\Http\Request;

class CoordinatorResultController extends Controller
{
    // =====================================================
    // GET RESULTS FOR COORDINATOR'S OWN EVENTS
    // =====================================================

    public function index()
    {
        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        $results = Result::with([
            'student',
            'event'
        ])
        ->whereHas('event', function ($query) use ($coordinator) {

            $query->where(
                'coordinator_id',
                $coordinator->id
            );

        })
        ->latest()
        ->get();

        return response()->json($results);
    }


    // =====================================================
    // GET COORDINATOR'S OWN EVENTS
    // =====================================================

    public function events()
    {
        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        $events = Event::where(
            'coordinator_id',
            $coordinator->id
        )
        ->latest()
        ->get();

        return response()->json($events);
    }


    // =====================================================
    // GET APPROVED PARTICIPANTS FOR EVENT
    // =====================================================

    public function participants($eventId)
    {
        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        // Make sure event belongs to coordinator
        $event = Event::where('id', $eventId)
            ->where(
                'coordinator_id',
                $coordinator->id
            )
            ->first();

        if (!$event) {
            return response()->json([
                'message' => 'Event not found'
            ], 404);
        }

        $students = Student::whereHas(
            'registrations',
            function ($query) use ($eventId) {

                $query->where(
                    'event_id',
                    $eventId
                )
                ->where(
                    'status',
                    'Approved'
                );

            }
        )->get();

        return response()->json($students);
    }


    // =====================================================
    // CREATE RESULT
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
            'event_id' => 'required|exists:events,id',
            'student_id' => 'required|exists:students,id',
            'position' => 'required|in:First,Second,Third,Participation',
            'remarks' => 'nullable|string|max:255',
        ]);

        // Check event belongs to coordinator
        $event = Event::where('id', $validated['event_id'])
            ->where(
                'coordinator_id',
                $coordinator->id
            )
            ->first();

        if (!$event) {
            return response()->json([
                'message' => 'You can only publish results for your own events.'
            ], 403);
        }

        // Check student is approved for this event
        $approved = $event->registrations()
            ->where(
                'student_id',
                $validated['student_id']
            )
            ->where(
                'status',
                'Approved'
            )
            ->exists();

        if (!$approved) {
            return response()->json([
                'message' => 'Student is not an approved participant for this event.'
            ], 422);
        }

        // Prevent duplicate winner position
        if (
            in_array(
                $validated['position'],
                ['First', 'Second', 'Third']
            )
        ) {

            $positionExists = Result::where(
                'event_id',
                $validated['event_id']
            )
            ->where(
                'position',
                $validated['position']
            )
            ->exists();

            if ($positionExists) {
                return response()->json([
                    'message' =>
                        $validated['position'] .
                        ' position is already assigned.'
                ], 422);
            }
        }

        $result = Result::create($validated);

        return response()->json([
            'message' => 'Result published successfully',
            'result' => $result->load([
                'student',
                'event'
            ])
        ], 201);
    }


    // =====================================================
    // UPDATE RESULT
    // =====================================================

    public function update(
        Request $request,
        $id
    ) {

        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        $result = Result::with('event')
            ->where('id', $id)
            ->whereHas('event', function ($query) use ($coordinator) {

                $query->where(
                    'coordinator_id',
                    $coordinator->id
                );

            })
            ->first();

        if (!$result) {
            return response()->json([
                'message' => 'Result not found'
            ], 404);
        }

        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'student_id' => 'required|exists:students,id',
            'position' => 'required|in:First,Second,Third,Participation',
            'remarks' => 'nullable|string|max:255',
        ]);

        $result->update($validated);

        return response()->json([
            'message' => 'Result updated successfully',
            'result' => $result->load([
                'student',
                'event'
            ])
        ]);
    }


    // =====================================================
    // DELETE RESULT
    // =====================================================

    public function destroy($id)
    {
        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        $result = Result::where('id', $id)
            ->whereHas('event', function ($query) use ($coordinator) {

                $query->where(
                    'coordinator_id',
                    $coordinator->id
                );

            })
            ->first();

        if (!$result) {
            return response()->json([
                'message' => 'Result not found'
            ], 404);
        }

        $result->delete();

        return response()->json([
            'message' => 'Result deleted successfully'
        ]);
    }
}