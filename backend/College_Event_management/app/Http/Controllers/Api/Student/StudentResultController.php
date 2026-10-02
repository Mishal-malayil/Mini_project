<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Result;
use Illuminate\Http\Request;

class StudentResultController extends Controller
{
    /**
     * Get results of the logged-in student.
     */
    public function index(Request $request)
    {
        $student = $request->user();

        if (!$student) {
            return response()->json([
                'message' => 'Student not authenticated.'
            ], 401);
        }

        $results = Result::with([
            'event.category',
            'event.coordinator'
        ])
        ->where('student_id', $student->id)
        ->latest()
        ->get()
        ->map(function ($result) {

            $event = $result->event;

            return [
                'id' => $result->id,

                'event_id' => $result->event_id,

                'event_name' => $event?->event_name,

                'event_date' => $event?->event_date,

                'venue' => $event?->venue,

                'category' => $event?->category,

                'coordinator' => $event?->coordinator,

                'position' => $result->position,

                'remarks' => $result->remarks,

                'created_at' => $result->created_at,
            ];
        });

        return response()->json([
            'results' => $results
        ], 200);
    }
}