<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\StudentNotificationRead;
use Illuminate\Http\Request;

class StudentNotificationController extends Controller
{
    // =========================
    // ALL STUDENT NOTIFICATIONS
    // =========================
    public function index(Request $request)
    {
        $student = $request->user();

        if (!$student) {
            return response()->json([
                'message' => 'Student not authenticated.'
            ], 401);
        }

        $announcements = Announcement::with([
            'event.category',
            'event.coordinator'
        ])
        ->latest('published_at')
        ->latest('id')
        ->get();

        return response()->json([
            'announcements' => $announcements
        ]);
    }


    // =========================
    // UNREAD NOTIFICATION COUNT
    // =========================
    public function unreadCount(Request $request)
    {
        $student = $request->user();

        if (!$student) {
            return response()->json([
                'message' => 'Student not authenticated.'
            ], 401);
        }

        $totalAnnouncements = Announcement::count();

        $seenAnnouncements = StudentNotificationRead::where(
            'student_id',
            $student->id
        )->count();

        $unreadCount = max(
            0,
            $totalAnnouncements - $seenAnnouncements
        );

        return response()->json([
            'count' => $unreadCount
        ]);
    }


    // =========================
    // MARK ALL AS SEEN
    // =========================
    public function markSeen(Request $request)
    {
        $student = $request->user();

        if (!$student) {
            return response()->json([
                'message' => 'Student not authenticated.'
            ], 401);
        }

        $announcements = Announcement::pluck('id');

        foreach ($announcements as $announcementId) {

            StudentNotificationRead::updateOrCreate(
                [
                    'student_id' => $student->id,
                    'announcement_id' => $announcementId,
                ],
                [
                    'seen_at' => now(),
                ]
            );
        }

        return response()->json([
            'message' => 'Notifications marked as seen.'
        ]);
    }
}