<?php

namespace App\Http\Controllers\Api\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class CoordinatorEventController extends Controller
{
    // =====================================================
    // GET ONLY LOGGED-IN COORDINATOR'S EVENTS
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

    return response()->json($events);
}


    // =====================================================
    // CREATE EVENT
    // =====================================================

   public function store(Request $request)
{
    $validated = $request->validate([
        'category_id' => 'required|exists:event_categories,id',
        'event_name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        'venue' => 'required|string|max:255',
        'event_date' => 'required|date',
        'start_time' => 'required',
        'end_time' => 'required',
        'max_participants' => 'nullable|integer|min:1',
    ]);

    $coordinator = $request->user('coordinator');

    $imagePath = null;

    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('events', 'public');
    }

    $event = Event::create([
        'category_id' => $validated['category_id'],
        'coordinator_id' => $coordinator->id,
        'event_name' => $validated['event_name'],
        'description' => $validated['description'] ?? null,
        'image' => $imagePath,
        'venue' => $validated['venue'],
        'event_date' => $validated['event_date'],
        'start_time' => $validated['start_time'],
        'end_time' => $validated['end_time'],
        'max_participants' => $validated['max_participants'] ?? null,
        'status' => 'Pending',
    ]);

    return response()->json([
        'message' => 'Event created successfully. Waiting for admin approval.',
        'event' => $event,
    ], 201);
}


    // =====================================================
    // VIEW SINGLE OWN EVENT
    // =====================================================

    public function show($id)
    {
        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        $event = Event::with('category')
            ->where('id', $id)
            ->where('coordinator_id', $coordinator->id)
            ->first();

        if (!$event) {
            return response()->json([
                'message' =>
                    'Event not found or you are not authorized to view this event.'
            ], 404);
        }

        return response()->json($event, 200);
    }


    // =====================================================
    // UPDATE ONLY OWN EVENT
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
            'message' =>
                'Event not found or you are not authorized to edit this event.'
        ], 404);
    }

    $validated = $request->validate([
        'category_id' =>
            'sometimes|required|exists:event_categories,id',

        'event_name' =>
            'sometimes|required|string|max:255',

        'description' =>
            'nullable|string',

        'image' =>
            'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',

        'venue' =>
            'sometimes|required|string|max:255',

        'event_date' =>
            'sometimes|required|date',

        'start_time' =>
            'sometimes|required|date_format:H:i:s',

        'end_time' =>
            'sometimes|required|date_format:H:i:s',

        'max_participants' =>
            'sometimes|required|integer|min:1',
    ]);

    /*
    |--------------------------------------------------------------------------
    | Handle new image
    |--------------------------------------------------------------------------
    */

    if ($request->hasFile('image')) {

        // Delete old image if it exists
        if ($event->image) {
            \Illuminate\Support\Facades\Storage::disk('public')
                ->delete($event->image);
        }

        // Store new image
        $validated['image'] = $request
            ->file('image')
            ->store('events', 'public');
    }

    /*
    |--------------------------------------------------------------------------
    | Approved event edited -> Pending
    |--------------------------------------------------------------------------
    */

    if ($event->status === 'Approved') {
        $validated['status'] = 'Pending';
    }

    // Never allow ownership to change
    $validated['coordinator_id'] = $coordinator->id;

    $event->update($validated);

    return response()->json([
        'message' =>
            'Event updated successfully. Waiting for admin approval.',

        'event' => $event
    ], 200);
}


    // =====================================================
    // DELETE ONLY OWN EVENT
    // =====================================================

    public function destroy($id)
    {
        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        // IMPORTANT:
        // Only find an event belonging to this coordinator
        $event = Event::where('id', $id)
            ->where('coordinator_id', $coordinator->id)
            ->first();

        if (!$event) {
            return response()->json([
                'message' =>
                    'Event not found or you are not authorized to delete this event.'
            ], 404);
        }

        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully.'
        ], 200);
    }
}