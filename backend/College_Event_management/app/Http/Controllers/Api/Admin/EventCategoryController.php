<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\EventCategory;
use Illuminate\Http\Request;

class EventCategoryController extends Controller
{
    // Display all categories
    public function index()
    {
        return response()->json(EventCategory::all(), 200);
    }

    // Store a new category
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_name' => 'required|string|max:255|unique:event_categories,category_name',
            'description'   => 'nullable|string',
            'status'        => 'required|boolean',
        ]);

        $category = EventCategory::create($validated);

        return response()->json([
            'message' => 'Event category created successfully',
            'category' => $category
        ], 201);
    }

    // Display one category
    public function show($id)
    {
        $category = EventCategory::find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Event category not found'
            ], 404);
        }

        return response()->json($category, 200);
    }

    // Update category
    public function update(Request $request, $id)
    {
        $category = EventCategory::find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Event category not found'
            ], 404);
        }

        $validated = $request->validate([
            'category_name' => 'required|string|max:255|unique:event_categories,category_name,' . $id,
            'description'   => 'nullable|string',
            'status' => 'required|boolean',
        ]);

        $category->update($validated);

        return response()->json([
            'message' => 'Event category updated successfully',
            'category' => $category
        ], 200);
    }

    // Delete category
    public function destroy($id)
    {
        $category = EventCategory::find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Event category not found'
            ], 404);
        }

        $category->delete();

        return response()->json([
            'message' => 'Event category deleted successfully'
        ], 200);
    }
}