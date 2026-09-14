<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StudentAuthController extends Controller
{
    // Student Registration
    public function register(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:students,email',
        'phone' => 'required|string|max:15',
        'department' => 'required|string|max:100',
        'semester' => 'required|integer|min:1|max:8',
        'password' => 'required|string|min:8|confirmed',
    ]);

    $student = Student::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'phone' => $validated['phone'],
        'department' => $validated['department'],
        'semester' => $validated['semester'],
        'password' => Hash::make($validated['password']),
    ]);

    return response()->json([
        'message' => 'Student registration successful. Please login.',
        'student' => $student,
    ], 201);
}


    // Student Login
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $student = Student::where('email', $validated['email'])->first();

        if (!$student || !Hash::check($validated['password'], $student->password)) {
            return response()->json([
                'message' => 'Invalid email or password'
            ], 401);
        }

        // Remove old tokens
        $student->tokens()->delete();

        $token = $student->createToken('student-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'student' => $student,
        ], 200);
    }


    // Student Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful'
        ]);
    }


    // Student Profile
    public function profile(Request $request)
    {
        return response()->json(
            $request->user()
        );
    }
}