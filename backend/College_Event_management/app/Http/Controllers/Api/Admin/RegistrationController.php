<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Registration;
use Illuminate\Http\Request;

class RegistrationController extends Controller
{
    // List all registrations
    public function index()
    {
        return response()->json(
            Registration::with(['student', 'event'])->get()
        );
    }

    // Create registration
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'event_id' => 'required|exists:events,id',
            'registration_date' => 'required|date',
            'status' => 'required|in:Pending,Approved,Rejected',
        ]);

        $registration = Registration::create($validated);

        return response()->json([
            'message' => 'Registration created successfully',
            'registration' => $registration
        ], 201);
    }

    // Show one registration
    public function show($id)
    {
        $registration = Registration::with(['student','event'])->find($id);

        if (!$registration) {
            return response()->json([
                'message' => 'Registration not found'
            ],404);
        }

        return response()->json($registration);
    }

    // Update registration
    public function update(Request $request, $id)
    {
        $registration = Registration::find($id);

        if (!$registration) {
            return response()->json([
                'message'=>'Registration not found'
            ],404);
        }

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'event_id' => 'required|exists:events,id',
            'registration_date' => 'required|date',
            'status' => 'required|in:Pending,Approved,Rejected',
        ]);

        $registration->update($validated);

        return response()->json([
            'message'=>'Registration updated successfully',
            'registration'=>$registration
        ]);
    }

    // Delete registration
    public function destroy($id)
    {
        $registration = Registration::find($id);

        if (!$registration) {
            return response()->json([
                'message'=>'Registration not found'
            ],404);
        }

        $registration->delete();

        return response()->json([
            'message'=>'Registration deleted successfully'
        ]);
    }
}