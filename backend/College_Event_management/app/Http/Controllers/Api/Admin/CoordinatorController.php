<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coordinator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class CoordinatorController extends Controller
{
    // Display all coordinators
    public function index()
    {
        return response()->json(Coordinator::all(), 200);
    }

    // Store a new coordinator
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'required|email|unique:coordinators,email',
            'phone'       => 'required|string|max:15',
            'department'  => 'required|string|max:100',
            'designation' => 'required|string|max:100',
            'password'    => 'required|min:6',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $coordinator = Coordinator::create($validated);

        return response()->json([
            'message' => 'Coordinator created successfully',
            'coordinator' => $coordinator
        ], 201);
    }

    // Display one coordinator
    public function show($id)
    {
        $coordinator = Coordinator::find($id);

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not found'
            ], 404);
        }

        return response()->json($coordinator, 200);
    }

    // Update coordinator
    public function update(Request $request, $id)
    {
        $coordinator = Coordinator::find($id);

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not found'
            ], 404);
        }

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'required|email|unique:coordinators,email,' . $id,
            'phone'       => 'required|string|max:15',
            'department'  => 'required|string|max:100',
            'designation' => 'required|string|max:100',
        ]);

        $coordinator->update($validated);

        return response()->json([
            'message' => 'Coordinator updated successfully',
            'coordinator' => $coordinator
        ], 200);
    }

    // Delete coordinator
    public function destroy($id)
    {
        $coordinator = Coordinator::find($id);

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not found'
            ], 404);
        }

        $coordinator->delete();

        return response()->json([
            'message' => 'Coordinator deleted successfully'
        ], 200);
    }
}