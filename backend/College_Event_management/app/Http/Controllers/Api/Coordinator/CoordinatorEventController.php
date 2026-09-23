<?php

namespace App\Http\Controllers\Api\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
        // -------------------------------------------------
        // VALIDATE REQUEST
        // -------------------------------------------------

        $validated = $request->validate([
            'category_id' => 'required|exists:event_categories,id',

            'event_name' => 'required|string|max:255',

            'description' => 'nullable|string',

            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',

            'venue' => 'required|string|max:255',

            'event_date' => 'required|date',

            'start_time' => 'required|date_format:H:i:s',

            'end_time' => 'required|date_format:H:i:s|after:start_time',

            'max_participants' => 'nullable|integer|min:1',
        ]);

        // -------------------------------------------------
        // GET LOGGED-IN COORDINATOR
        // -------------------------------------------------

        $coordinator = $request->user('coordinator');

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        // =================================================
        // CHECK VENUE + DATE + TIME CONFLICT
        // =================================================

        /*
        Existing event:
        10:00 - 12:00

        New event:
        11:00 - 13:00

        Conflict = YES

        Existing event:
        10:00 - 12:00

        New event:
        12:00 - 14:00

        Conflict = NO
        */

        $venueConflict = Event::where('venue', $validated['venue'])
            ->where('event_date', $validated['event_date'])

            // Pending and Approved events occupy the venue.
            // Rejected events do not.
            ->whereIn('status', ['Pending', 'Approved'])

            ->where(function ($query) use ($validated) {

                $query->where(
                    'start_time',
                    '<',
                    $validated['end_time']
                )
                ->where(
                    'end_time',
                    '>',
                    $validated['start_time']
                );

            })
            ->exists();

        // -------------------------------------------------
        // RETURN CONFLICT ERROR
        // -------------------------------------------------

        if ($venueConflict) {
            return response()->json([
                'message' =>
                    'This venue is already booked during the selected time.'
            ], 422);
        }

        // =================================================
        // STORE IMAGE
        // =================================================

        $imagePath = null;

        if ($request->hasFile('image')) {

            $imagePath = $request
                ->file('image')
                ->store('events', 'public');
        }

        // =================================================
        // CREATE EVENT
        // =================================================

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

            'max_participants' =>
                $validated['max_participants'] ?? null,

            // New events need admin approval
            'status' => 'Pending',
        ]);

        // =================================================
        // RESPONSE
        // =================================================

        return response()->json([

            'message' =>
                'Event created successfully. Waiting for admin approval.',

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

        // Only allow coordinator to view their own event
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
        // -------------------------------------------------
        // GET LOGGED-IN COORDINATOR
        // -------------------------------------------------

        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        // -------------------------------------------------
        // FIND OWN EVENT
        // -------------------------------------------------

        $event = Event::where('id', $id)
            ->where('coordinator_id', $coordinator->id)
            ->first();

        if (!$event) {
            return response()->json([
                'message' =>
                    'Event not found or you are not authorized to edit this event.'
            ], 404);
        }

        // =================================================
        // VALIDATE REQUEST
        // =================================================

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
                'sometimes|required|date_format:H:i:s|after:start_time',

            'max_participants' =>
                'sometimes|required|integer|min:1',
        ]);

        // =================================================
        // GET FINAL VALUES
        // =================================================

        /*
        If a field was not included in the update request,
        use the existing event value.
        */

        $venue =
            $validated['venue']
            ?? $event->venue;

        $eventDate =
            $validated['event_date']
            ?? $event->event_date;

        $startTime =
            $validated['start_time']
            ?? $event->start_time;

        $endTime =
            $validated['end_time']
            ?? $event->end_time;

        // =================================================
        // CHECK VENUE + DATE + TIME CONFLICT
        // =================================================

        $venueConflict = Event::where('venue', $venue)

            ->where('event_date', $eventDate)

            // Pending and Approved events block the venue
            ->whereIn('status', ['Pending', 'Approved'])

            // IMPORTANT:
            // Do not compare the event with itself
            ->where('id', '!=', $event->id)

            ->where(function ($query) use (
                $startTime,
                $endTime
            ) {

                $query->where(
                    'start_time',
                    '<',
                    $endTime
                )
                ->where(
                    'end_time',
                    '>',
                    $startTime
                );

            })
            ->exists();

        // -------------------------------------------------
        // RETURN CONFLICT ERROR
        // -------------------------------------------------

        if ($venueConflict) {
            return response()->json([
                'message' =>
                    'This venue is already booked during the selected time.'
            ], 422);
        }

        // =================================================
        // HANDLE NEW IMAGE
        // =================================================

        if ($request->hasFile('image')) {

            // ---------------------------------------------
            // DELETE OLD IMAGE
            // ---------------------------------------------

            if ($event->image) {

                Storage::disk('public')
                    ->delete($event->image);
            }

            // ---------------------------------------------
            // STORE NEW IMAGE
            // ---------------------------------------------

            $validated['image'] =
                $request
                    ->file('image')
                    ->store('events', 'public');
        }

        // =================================================
        // APPROVED EVENT EDITED
        // =================================================

        /*
        If admin already approved the event and coordinator
        changes it, send it back to Pending.

        Admin must approve the changes again.
        */

        if ($event->status === 'Approved') {
            $validated['status'] = 'Pending';
        }

        // =================================================
        // PREVENT OWNERSHIP CHANGE
        // =================================================

        $validated['coordinator_id'] =
            $coordinator->id;

        // =================================================
        // UPDATE EVENT
        // =================================================

        $event->update($validated);

        // Refresh event data
        $event->refresh();

        // =================================================
        // RESPONSE
        // =================================================

        return response()->json([

            'message' =>
                'Event updated successfully. Waiting for admin approval.',

            'event' => $event,

        ], 200);
    }


    // =====================================================
    // DELETE ONLY OWN EVENT
    // =====================================================

    public function destroy($id)
    {
        // -------------------------------------------------
        // GET LOGGED-IN COORDINATOR
        // -------------------------------------------------

        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        // -------------------------------------------------
        // FIND ONLY OWN EVENT
        // -------------------------------------------------

        $event = Event::where('id', $id)
            ->where('coordinator_id', $coordinator->id)
            ->first();

        if (!$event) {
            return response()->json([
                'message' =>
                    'Event not found or you are not authorized to delete this event.'
            ], 404);
        }

        // =================================================
        // DELETE IMAGE
        // =================================================

        if ($event->image) {

            Storage::disk('public')
                ->delete($event->image);
        }

        // =================================================
        // DELETE EVENT
        // =================================================

        $event->delete();

        // =================================================
        // RESPONSE
        // =================================================

        return response()->json([
            'message' => 'Event deleted successfully.'
        ], 200);
    }
}