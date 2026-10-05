<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;

class StudentNotificationController extends Controller
{
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
}