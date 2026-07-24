<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Coordinator;
use App\Models\EventCategory;
use App\Models\Event;
use App\Models\Registration;
use App\Models\Attendance;
use App\Models\Result;
use App\Models\Announcement;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([

            // Cards
            'total_students' => Student::count(),
            'total_coordinators' => Coordinator::count(),
            'total_categories' => EventCategory::count(),
            'total_events' => Event::count(),
            'total_registrations' => Registration::count(),
            'total_attendances' => Attendance::count(),
            'total_results' => Result::count(),
            'total_announcements' => Announcement::count(),

            // Event Status
            'approved_events' => Event::where('status', 'Approved')->count(),
            'pending_events' => Event::where('status', 'Pending')->count(),
            'rejected_events' => Event::where('status', 'Rejected')->count(),

            // Attendance Status
            'present_students' => Attendance::where('status', 'Present')->count(),
            'absent_students' => Attendance::where('status', 'Absent')->count(),

            // Registration Status
            'approved_registrations' => Registration::where('status', 'Approved')->count(),
            'pending_registrations' => Registration::where('status', 'Pending')->count(),
            'rejected_registrations' => Registration::where('status', 'Rejected')->count(),

        ]);
    }
}