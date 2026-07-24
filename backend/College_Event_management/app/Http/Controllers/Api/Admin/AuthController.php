<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $admin = Admin::where('email', $request->email)->first();

    if (!$admin || !Hash::check($request->password, $admin->password)) {
        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }

    // Delete old tokens (optional)
    $admin->tokens()->delete();

    // Create a new token
    $token = $admin->createToken('admin-token')->plainTextToken;

    return response()->json([
        'message' => 'Login successful',
        'token' => $token,
        'admin' => $admin
    ]);
}

    public function logout(Request $request)
{
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'message' => 'Logout successful'
    ]);
}
}