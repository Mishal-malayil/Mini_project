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

    // Store new event (Coordinator)
    public function store(Request $request)
    {
        $validated = $request->validate([

            'category_id' => 'required|exists:event_categories,id',

            'coordinator_id' => 'required|exists:coordinators,id',

            'event_name' => 'required|string|max:255',

            'description' => 'nullable|string',

            'venue' => 'required|string|max:255',

            'event_date' => 'required|date',

            'start_time' => 'required|date_format:H:i:s',

            'end_time' => 'required|date_format:H:i:s',

            'max_participants' => 'required|integer|min:1',

        ]);

        // Default Status
        $validated['status'] = 'Pending';

        $event = Event::create($validated);

        return response()->json([
            'message' => 'Event submitted successfully. Waiting for admin approval.',
            'event' => $event
        ], 201);
    }

    // Display single event
    public function show($id)
    {
        $event = Event::with(['category', 'coordinator'])->find($id);

        if (!$event) {

            return response()->json([
                'message' => 'Event not found'
            ],404);

        }

        return response()->json($event);
    }

    // Update event details
    public function update(Request $request, $id)
    {
        $event = Event::find($id);

        if(!$event){

            return response()->json([
                'message'=>'Event not found'
            ],404);

        }

        $validated = $request->validate([

            'category_id' => 'sometimes|required|exists:event_categories,id',

            'coordinator_id' => 'sometimes|required|exists:coordinators,id',

            'event_name' => 'sometimes|required|string|max:255',

            'description' => 'nullable|string',

            'venue' => 'sometimes|required|string|max:255',

            'event_date' => 'sometimes|required|date',

            'start_time' => 'sometimes|required|date_format:H:i:s',

            'end_time' => 'sometimes|required|date_format:H:i:s',

            'max_participants' => 'sometimes|required|integer|min:1',

            'status' => 'sometimes|required|in:Pending,Approved,Rejected',

        ]);

        $event->update($validated);

        return response()->json([
            'message'=>'Event updated successfully',
            'event'=>$event
        ]);
    }

    // Approve Event
    public function approve($id)
    {
        $event = Event::find($id);

        if(!$event){

            return response()->json([
                'message'=>'Event not found'
            ],404);

        }

        $event->status = 'Approved';

        $event->save();

        return response()->json([
            'message'=>'Event approved successfully',
            'event'=>$event
        ]);
    }

    // Reject Event
    public function reject($id)
    {
        $event = Event::find($id);

        if(!$event){

            return response()->json([
                'message'=>'Event not found'
            ],404);

        }

        $event->status = 'Rejected';

        $event->save();

        return response()->json([
            'message'=>'Event rejected successfully',
            'event'=>$event
        ]);
    }

    // Delete Event
    public function destroy($id)
    {
        $event = Event::find($id);

        if(!$event){

            return response()->json([
                'message'=>'Event not found'
            ],404);

        }

        $event->delete();

        return response()->json([
            'message'=>'Event deleted successfully'
        ]);
    }
}