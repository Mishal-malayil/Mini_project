<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    // View logged-in admin profile
    public function profile(Request $request)
    {
        return response()->json($request->user(), 200);
    }

    // Update logged-in admin profile
    public function updateProfile(Request $request)
    {
        $admin = $request->user();

        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:admins,email,' . $admin->id,
        ]);

        $admin->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'admin'   => $admin
        ], 200);
    }

    public function changePassword(Request $request)
{
    $admin = $request->user();

    $validated = $request->validate([
        'current_password' => 'required|string',
        'new_password' => 'required|string|min:6|confirmed',
    ]);

    // Check current password
    if (!Hash::check($validated['current_password'], $admin->password)) {

        return response()->json([
            'message' => 'Current password is incorrect.'
        ], 422);
    }

    // Update password
    $admin->password = Hash::make($validated['new_password']);
    $admin->save();

    return response()->json([
        'message' => 'Password changed successfully.'
    ], 200);
}
}