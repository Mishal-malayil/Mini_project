<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentPasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class StudentAuthController extends Controller
{
    // ==========================================
    // STUDENT REGISTRATION
    // ==========================================

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

    // ==========================================
    // STUDENT LOGIN
    // ==========================================

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $email = strtolower(trim($validated['email']));

        $student = Student::where('email', $email)->first();

        if (
            !$student ||
            !Hash::check($validated['password'], $student->password)
        ) {
            return response()->json([
                'message' => 'Invalid email or password.',
            ], 401);
        }

        // Remove existing tokens.
        $student->tokens()->delete();

        $token = $student->createToken('student-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'token' => $token,
            'student' => $student,
        ], 200);
    }

    // ==========================================
    // STUDENT LOGOUT
    // ==========================================

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful.',
        ]);
    }

    // ==========================================
    // STUDENT PROFILE
    // ==========================================

    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    // ==========================================
    // CHANGE PASSWORD WHILE LOGGED IN
    // ==========================================

    public function updatePassword(Request $request)
    {
        $student = $request->user();

        if (!$student) {
            return response()->json([
                'message' => 'Student not authenticated.',
            ], 401);
        }

        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check(
            $validated['current_password'],
            $student->password
        )) {
            return response()->json([
                'message' => 'Current password is incorrect.',
            ], 422);
        }

        if (Hash::check(
            $validated['password'],
            $student->password
        )) {
            return response()->json([
                'message' => 'New password must be different from your current password.',
            ], 422);
        }

        $student->password = Hash::make($validated['password']);
        $student->save();

        // Invalidate all existing student tokens.
        $student->tokens()->delete();

        return response()->json([
            'message' => 'Password updated successfully. Please login again.',
        ]);
    }

    // ==========================================
    // FORGOT PASSWORD - GENERATE OTP
    // ==========================================

    public function forgotPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $email = strtolower(trim($validated['email']));

        $genericMessage =
            'If the email is registered, a password-reset OTP has been generated.';

        $student = Student::where('email', $email)->first();

        // Do not disclose whether an email belongs to a student.
        if (!$student) {
            return response()->json([
                'message' => $genericMessage,
            ]);
        }

        // Remove any previous reset request for this email.
        StudentPasswordReset::where('email', $email)->delete();

        // Generate a six-digit OTP.
        $otp = (string) random_int(100000, 999999);

        // Store only the hashed OTP.
        StudentPasswordReset::create([
            'email' => $email,
            'otp_hash' => Hash::make($otp),
            'expires_at' => now()->addMinutes(5),
            'attempts' => 0,
            'verified_at' => null,
        ]);

        // DEVELOPMENT ONLY: never log OTPs in production.
        Log::info('Student password reset OTP generated', [
            'email' => $email,
            'otp' => $otp,
        ]);

        return response()->json([
            'message' => $genericMessage,
        ]);
    }

    // ==========================================
    // VERIFY PASSWORD RESET OTP
    // ==========================================

    public function verifyResetOtp(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6',
        ]);

        $email = strtolower(trim($validated['email']));

        $reset = StudentPasswordReset::where('email', $email)
            ->latest('id')
            ->first();

        if (!$reset) {
            return response()->json([
                'message' => 'Invalid or expired OTP. Please request a new one.',
            ], 422);
        }

        if (now()->greaterThanOrEqualTo($reset->expires_at)) {
            $reset->delete();

            return response()->json([
                'message' => 'OTP has expired. Please request a new one.',
            ], 422);
        }

        if ($reset->attempts >= 5) {
            return response()->json([
                'message' => 'Too many attempts. Please request a new OTP.',
            ], 429);
        }

        if (!Hash::check($validated['otp'], $reset->otp_hash)) {
            $reset->increment('attempts');

            return response()->json([
                'message' => 'Invalid OTP. Please try again.',
            ], 422);
        }

        // Mark the OTP as verified.
        $reset->verified_at = now();
        $reset->save();

        return response()->json([
            'message' => 'OTP verified successfully.',
        ]);
    }

    // ==========================================
    // RESET PASSWORD
    // ==========================================

    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6',
            'new_password' => 'required|string|min:8|same:new_password_confirmation',
            'new_password_confirmation' => 'required|string',
        ]);

        $email = strtolower(trim($validated['email']));

        $reset = StudentPasswordReset::where('email', $email)
            ->latest('id')
            ->first();

        if (!$reset) {
            return response()->json([
                'message' => 'Reset request not found. Please request a new OTP.',
            ], 422);
        }

        if (now()->greaterThanOrEqualTo($reset->expires_at)) {
            $reset->delete();

            return response()->json([
                'message' => 'OTP has expired. Please request a new one.',
            ], 422);
        }

        if ($reset->attempts >= 5) {
            return response()->json([
                'message' => 'Too many attempts. Please request a new OTP.',
            ], 429);
        }

        // Require successful OTP verification.
        if (!$reset->verified_at) {
            return response()->json([
                'message' => 'Please verify your OTP before resetting the password.',
            ], 422);
        }

        // Verify the same OTP again before allowing the reset.
        if (!Hash::check($validated['otp'], $reset->otp_hash)) {
            $reset->increment('attempts');

            return response()->json([
                'message' => 'Invalid OTP.',
            ], 422);
        }

        $student = Student::where('email', $email)->first();

        if (!$student) {
            $reset->delete();

            return response()->json([
                'message' => 'Unable to reset the password.',
            ], 422);
        }

        // Update the password.
        $student->password = Hash::make($validated['new_password']);
        $student->save();

        // Invalidate all student login tokens.
        $student->tokens()->delete();

        // Delete the reset record so the OTP cannot be reused.
        $reset->delete();

        return response()->json([
            'message' => 'Password reset successfully. Please log in with your new password.',
        ]);
    }
}