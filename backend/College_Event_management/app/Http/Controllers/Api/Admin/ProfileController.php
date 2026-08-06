<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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
}