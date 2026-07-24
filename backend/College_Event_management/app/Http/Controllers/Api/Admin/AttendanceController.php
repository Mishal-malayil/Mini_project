<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index()
    {
        return Attendance::with('registration')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'registration_id' => 'required|exists:registrations,id',
            'attendance_date' => 'required|date',
            'status' => 'required|in:Present,Absent'
        ]);

        $attendance = Attendance::create($validated);

        return response()->json([
            'message' => 'Attendance created successfully',
            'attendance' => $attendance
        ], 201);
    }

    public function show($id)
    {
        $attendance = Attendance::with('registration')->find($id);

        if (!$attendance) {
            return response()->json([
                'message' => 'Attendance not found'
            ], 404);
        }

        return response()->json($attendance);
    }

    public function update(Request $request, $id)
    {
        $attendance = Attendance::find($id);

        if (!$attendance) {
            return response()->json([
                'message' => 'Attendance not found'
            ], 404);
        }

        $validated = $request->validate([
            'registration_id' => 'required|exists:registrations,id',
            'attendance_date' => 'required|date',
            'status' => 'required|in:Present,Absent'
        ]);

        $attendance->update($validated);

        return response()->json([
            'message' => 'Attendance updated successfully',
            'attendance' => $attendance
        ]);
    }

    public function destroy($id)
    {
        $attendance = Attendance::find($id);

        if (!$attendance) {
            return response()->json([
                'message' => 'Attendance not found'
            ], 404);
        }

        $attendance->delete();

        return response()->json([
            'message' => 'Attendance deleted successfully'
        ]);
    }
}