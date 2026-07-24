<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Result;
use Illuminate\Http\Request;

class ResultController extends Controller
{
    // Display all results
    public function index()
    {
        return response()->json(
            Result::with(['student', 'event'])->get()
        );
    }

    // Store a result
    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'student_id' => 'required|exists:students,id',
            'position' => 'required|in:First,Second,Third,Participation',
            'remarks' => 'nullable|string|max:255',
        ]);

        $result = Result::create($validated);

        return response()->json([
            'message' => 'Result created successfully',
            'result' => $result
        ], 201);
    }

    // Show one result
    public function show($id)
    {
        $result = Result::with(['student', 'event'])->find($id);

        if (!$result) {
            return response()->json([
                'message' => 'Result not found'
            ], 404);
        }

        return response()->json($result);
    }

    // Update result
    public function update(Request $request, $id)
    {
        $result = Result::find($id);

        if (!$result) {
            return response()->json([
                'message' => 'Result not found'
            ], 404);
        }

        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'student_id' => 'required|exists:students,id',
            'position' => 'required|in:First,Second,Third,Participation',
            'remarks' => 'nullable|string|max:255',
        ]);

        $result->update($validated);

        return response()->json([
            'message' => 'Result updated successfully',
            'result' => $result
        ]);
    }

    // Delete result
    public function destroy($id)
    {
        $result = Result::find($id);

        if (!$result) {
            return response()->json([
                'message' => 'Result not found'
            ], 404);
        }

        $result->delete();

        return response()->json([
            'message' => 'Result deleted successfully'
        ]);
    }
}