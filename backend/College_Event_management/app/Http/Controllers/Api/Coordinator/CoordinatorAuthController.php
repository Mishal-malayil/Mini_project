<?php

namespace App\Http\Controllers\Api\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\Coordinator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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

        if (!$coordinator ||
            !Hash::check($validated['password'], $coordinator->password)) {

            return response()->json([
                'message' => 'Invalid email or password'
            ], 401);
        }

        // Remove old tokens if required
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

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful'
        ]);
    }

    public function profile(Request $request)
    {
        return response()->json(
            $request->user()
        );
    }
}