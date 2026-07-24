<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    // Display all students
    public function index()
    {
        return response()->json(Student::all(), 200);
    }

    // Store a new student
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|unique:students,email',
            'phone'      => 'required|string|max:15',
            'department' => 'required|string|max:100',
            'semester'   => 'required|string|max:20',
            'password'   => 'required|min:6',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $student = Student::create($validated);

        return response()->json([
            'message' => 'Student created successfully',
            'student' => $student
        ], 201);
    }

    // Display a single student
    public function show($id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json([
                'message' => 'Student not found'
            ], 404);
        }

        return response()->json($student, 200);
    }

    // Update a student
    public function update(Request $request, $id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json([
                'message' => 'Student not found'
            ], 404);
        }

        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|unique:students,email,' . $id,
            'phone'      => 'required|string|max:15',
            'department' => 'required|string|max:100',
            'semester'   => 'required|string|max:20',
        ]);

        $student->update($validated);

        return response()->json([
            'message' => 'Student updated successfully',
            'student' => $student
        ], 200);
    }

    // Delete a student
    public function destroy($id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json([
                'message' => 'Student not found'
            ], 404);
        }

        $student->delete();

        return response()->json([
            'message' => 'Student deleted successfully'
        ], 200);
    }
}