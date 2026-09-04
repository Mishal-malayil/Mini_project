<?php

namespace App\Http\Controllers\Api\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\Coordinator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\CoordinatorPasswordReset;
use Illuminate\Support\Facades\Mail;

class CoordinatorAuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $coordinator = Coordinator::where(
            'email',
            $validated['email']
        )->first();

        if (
            !$coordinator ||
            !Hash::check(
                $validated['password'],
                $coordinator->password
            )
        ) {
            return response()->json([
                'message' => 'Invalid email or password'
            ], 401);
        }

        $coordinator->tokens()->delete();

        $token = $coordinator->createToken(
            'coordinator-token'
        )->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'coordinator' => $coordinator
        ], 200);
    }


    // =========================
    // LOGOUT
    // =========================

    public function logout(Request $request)
    {
        $request->user()
            ->currentAccessToken()
            ->delete();

        return response()->json([
            'message' => 'Logout successful'
        ]);
    }


    // =========================
    // PROFILE
    // =========================

    public function profile(Request $request)
    {
        return response()->json(
            $request->user()
        );
    }


    // =========================
    // UPDATE PASSWORD
    // =========================

    public function updatePassword(Request $request)
    {
        $coordinator = $request->user();

        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'different:current_password'
            ],
        ]);


        // Check current password
        if (
            !Hash::check(
                $validated['current_password'],
                $coordinator->password
            )
        ) {
            return response()->json([
                'message' => 'Current password is incorrect.'
            ], 422);
        }


        // Update password
        $coordinator->password = Hash::make(
            $validated['new_password']
        );

        $coordinator->save();


        return response()->json([
            'message' => 'Password updated successfully.'
        ], 200);
    }

//forgot password


    public function forgotPassword(Request $request)
{
    $validated = $request->validate([
        'email' => 'required|email',
    ]);

    $coordinator = Coordinator::where(
        'email',
        $validated['email']
    )->first();

    if (!$coordinator) {
        return response()->json([
            'message' => 'No coordinator account found with this email.'
        ], 404);
    }

    // Remove previous OTPs
    CoordinatorPasswordReset::where(
        'email',
        $validated['email']
    )->delete();

    // Generate 6 digit OTP
    $otp = (string) random_int(100000, 999999);

    CoordinatorPasswordReset::create([
        'email' => $validated['email'],
        'otp' => $otp,
        'expires_at' => now()->addMinutes(10),
        'verified' => false,
    ]);

    // Send OTP email
    Mail::raw(
        "Your College Event Management password reset OTP is: {$otp}\n\n"
        . "This OTP will expire in 10 minutes.",
        function ($message) use ($validated) {
            $message
                ->to($validated['email'])
                ->subject('Coordinator Password Reset OTP');
        }
    );

    return response()->json([
        'message' => 'OTP sent successfully to your email.'
    ], 200);
}

//otp verification

    public function verifyResetOtp(Request $request)
{
    $validated = $request->validate([
        'email' => 'required|email',
        'otp' => 'required|digits:6',
    ]);

    $reset = CoordinatorPasswordReset::where(
        'email',
        $validated['email']
    )
    ->where('otp', $validated['otp'])
    ->where('verified', false)
    ->first();

    if (!$reset) {
        return response()->json([
            'message' => 'Invalid OTP.'
        ], 422);
    }

    if ($reset->expires_at->isPast()) {
        return response()->json([
            'message' => 'OTP has expired. Please request a new OTP.'
        ], 422);
    }

    $reset->update([
        'verified' => true
    ]);

    return response()->json([
        'message' => 'OTP verified successfully.'
    ], 200);
}
 
//reset password

public function resetPassword(Request $request)
{
    $validated = $request->validate([
        'email' => 'required|email',
        'new_password' => [
            'required',
            'string',
            'min:8',
            'confirmed',
        ],
    ]);

    $reset = CoordinatorPasswordReset::where(
        'email',
        $validated['email']
    )
    ->where('verified', true)
    ->latest()
    ->first();

    if (!$reset) {
        return response()->json([
            'message' => 'Please verify the OTP first.'
        ], 422);
    }

    if ($reset->expires_at->isPast()) {
        return response()->json([
            'message' => 'Password reset session has expired.'
        ], 422);
    }

    $coordinator = Coordinator::where(
        'email',
        $validated['email']
    )->first();

    if (!$coordinator) {
        return response()->json([
            'message' => 'Coordinator account not found.'
        ], 404);
    }

    $coordinator->password = Hash::make(
        $validated['new_password']
    );

    $coordinator->save();

    // Delete reset record after successful reset
    $reset->delete();

    return response()->json([
        'message' => 'Password reset successfully.'
    ], 200);
}

}