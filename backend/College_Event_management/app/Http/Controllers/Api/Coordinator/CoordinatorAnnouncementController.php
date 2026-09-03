<?php

namespace App\Http\Controllers\Api\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;

class CoordinatorAnnouncementController extends Controller
{
    // Get announcements created for coordinator's own events
    public function index()
    {
        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        $announcements = Announcement::with('event')
            ->whereHas('event', function ($query) use ($coordinator) {
                $query->where('coordinator_id', $coordinator->id);
            })
            ->latest()
            ->get();

        return response()->json($announcements, 200);
    }


    // Get single announcement
    public function show($id)
    {
        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        $announcement = Announcement::with('event')
            ->where('id', $id)
            ->whereHas('event', function ($query) use ($coordinator) {
                $query->where('coordinator_id', $coordinator->id);
            })
            ->first();

        if (!$announcement) {
            return response()->json([
                'message' => 'Announcement not found'
            ], 404);
        }

        return response()->json($announcement, 200);
    }


    // Send announcement
    public function store(Request $request)
    {
        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'event_id' => 'required|exists:events,id',
            'published_at' => 'required|date',
        ]);

        // Security check:
        // Make sure this event belongs to the logged-in coordinator
        $event = $coordinator->events()
            ->where('id', $validated['event_id'])
            ->first();

        if (!$event) {
            return response()->json([
                'message' => 'You are not authorized to send announcements for this event.'
            ], 403);
        }

        $announcement = Announcement::create($validated);

        return response()->json([
            'message' => 'Announcement sent successfully',
            'announcement' => $announcement
        ], 201);
    }


    // Delete coordinator announcement
    public function destroy($id)
    {
        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        $announcement = Announcement::where('id', $id)
            ->whereHas('event', function ($query) use ($coordinator) {
                $query->where('coordinator_id', $coordinator->id);
            })
            ->first();

        if (!$announcement) {
            return response()->json([
                'message' => 'Announcement not found'
            ], 404);
        }

        $announcement->delete();

        return response()->json([
            'message' => 'Announcement deleted successfully'
        ], 200);
    }
}