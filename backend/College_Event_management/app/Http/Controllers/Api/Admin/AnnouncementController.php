<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    // Display all announcements
    public function index()
    {
        $announcements = Announcement::with('event')->get();

        return response()->json($announcements, 200);
    }

    // Store a new announcement
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'event_id' => 'nullable|exists:events,id',
            'published_at' => 'required|date',
        ]);

        $announcement = Announcement::create($validated);

        return response()->json([
            'message' => 'Announcement created successfully',
            'announcement' => $announcement
        ], 201);
    }

    // Display a single announcement
    public function show($id)
    {
        $announcement = Announcement::with('event')->find($id);

        if (!$announcement) {
            return response()->json([
                'message' => 'Announcement not found'
            ], 404);
        }

        return response()->json($announcement, 200);
    }

    // Update an announcement
    public function update(Request $request, $id)
    {
        $announcement = Announcement::find($id);

        if (!$announcement) {
            return response()->json([
                'message' => 'Announcement not found'
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'event_id' => 'nullable|exists:events,id',
            'published_at' => 'required|date',
        ]);

        $announcement->update($validated);

        return response()->json([
            'message' => 'Announcement updated successfully',
            'announcement' => $announcement
        ], 200);
    }

    // Delete an announcement
    public function destroy($id)
    {
        $announcement = Announcement::find($id);

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