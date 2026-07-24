<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    // Display all events
    public function index()
    {
        $events = Event::with(['category', 'coordinator'])->get();

        return response()->json($events, 200);
    }

    // Store a new event
    public function store(Request $request)
    {
        $validated = $request->validate([
    'event_name' => 'required|string|max:255',
    'category_id' => 'required|exists:event_categories,id',
    'coordinator_id' => 'required|exists:coordinators,id',
    'event_date' => 'required|date',
    'start_time' => 'required|date_format:H:i:s',
    'end_time' => 'required|date_format:H:i:s',
    'venue' => 'required|string|max:255',
    'max_participants' => 'required|integer|min:1',
    'description' => 'nullable|string',
    'status' => 'required|in:Pending,Approved,Rejected',
]);

        $event = Event::create($validated);

        return response()->json([
            'message' => 'Event created successfully',
            'event' => $event
        ], 201);
    }

    // Display one event
    public function show($id)
    {
        $event = Event::with(['category', 'coordinator'])->find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Event not found'
            ], 404);
        }

        return response()->json($event);
    }

    // Update event
    public function update(Request $request, $id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Event not found'
            ], 404);
        }

        $validated = $request->validate([
            'event_name' => 'required|string|max:255',
            'category_id' => 'required|exists:event_categories,id',
            'coordinator_id' => 'required|exists:coordinators,id',
            'event_date' => 'required|date',
            'venue' => 'required|string|max:255',
            'max_participants' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'status' => 'required|in:Pending,Approved,Rejected'
        ]);

        $event->update($validated);

        return response()->json([
            'message' => 'Event updated successfully',
            'event' => $event
        ]);
    }

    // Delete event
    public function destroy($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Event not found'
            ], 404);
        }

        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully'
        ]);
    }
}