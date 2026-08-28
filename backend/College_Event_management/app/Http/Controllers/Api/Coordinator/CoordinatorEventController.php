<?php

namespace App\Http\Controllers\Api\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class CoordinatorEventController extends Controller
{
    // =====================================================
    // GET COORDINATOR'S EVENTS
    // =====================================================

    public function index()
    {
        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        $events = Event::with('category')
            ->where('coordinator_id', $coordinator->id)
            ->latest()
            ->get();

        return response()->json($events, 200);
    }


    // =====================================================
    // CREATE EVENT
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
            'category_id' => 'required|exists:event_categories,id',
            'event_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'venue' => 'required|string|max:255',
            'event_date' => 'required|date',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s',
            'max_participants' => 'required|integer|min:1',
        ]);

        // ALWAYS use logged-in coordinator
        $validated['coordinator_id'] = $coordinator->id;

        // New event requires admin approval
        $validated['status'] = 'Pending';

        $event = Event::create($validated);

        return response()->json([
            'message' => 'Event created successfully. Waiting for admin approval.',
            'event' => $event
        ], 201);
    }


    // =====================================================
    // SHOW SINGLE OWN EVENT
    // =====================================================

    public function show($id)
{
    $coordinator = auth('coordinator')->user();

    if (!$coordinator) {
        return response()->json([
            'message' => 'Coordinator not authenticated'
        ], 401);
    }

    $event = Event::with(['category'])
        ->where('id', $id)
        ->where('coordinator_id', $coordinator->id)
        ->first();

    if (!$event) {
        return response()->json([
            'message' => 'Event not found or you are not authorized to view this event.'
        ], 404);
    }

    return response()->json($event);
}
    // =====================================================
    // UPDATE OWN EVENT
    // =====================================================

    public function update(Request $request, $id)
    {
        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        $event = Event::where('id', $id)
            ->where('coordinator_id', $coordinator->id)
            ->first();

        if (!$event) {
            return response()->json([
                'message' => 'Event not found or unauthorized'
            ], 404);
        }

        $validated = $request->validate([
            'category_id' => 'sometimes|required|exists:event_categories,id',
            'event_name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'venue' => 'sometimes|required|string|max:255',
            'event_date' => 'sometimes|required|date',
            'start_time' => 'sometimes|required|date_format:H:i:s',
            'end_time' => 'sometimes|required|date_format:H:i:s',
            'max_participants' => 'sometimes|required|integer|min:1',
        ]);

        if ($event->status === 'Approved') {
            $validated['status'] = 'Pending';
        }

        $event->update($validated);

        return response()->json([
            'message' => 'Event updated successfully. Waiting for admin approval.',
            'event' => $event
        ], 200);
    }
}