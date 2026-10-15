<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\EventCategory;
use Illuminate\Http\Request;

class EventCategoryController extends Controller
{
    // Display all categories with automatically calculated status
    public function index()
    {
        $categories = EventCategory::withCount('events')
            ->get()
            ->map(function ($category) {
                $category->status = $category->events_count > 0;

                return $category;
            });

        return response()->json($categories, 200);
    }

    // Store a new category
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_name' => 'required|string|max:255|unique:event_categories,category_name',
            'description' => 'nullable|string',
        ]);

        $category = EventCategory::create([
            'category_name' => $validated['category_name'],
            'description' => $validated['description'] ?? null,
            'status' => false,
        ]);

        $category->loadCount('events');

        return response()->json([
            'message' => 'Event category created successfully',
            'category' => $category,
        ], 201);
    }

    // Display one category
    public function show($id)
    {
        $category = EventCategory::withCount('events')->find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Event category not found',
            ], 404);
        }

        $category->status = $category->events_count > 0;

        return response()->json($category, 200);
    }

    // Update category details
    public function update(Request $request, $id)
    {
        $category = EventCategory::find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Event category not found',
            ], 404);
        }

        $validated = $request->validate([
            'category_name' => 'required|string|max:255|unique:event_categories,category_name,' . $id,
            'description' => 'nullable|string',
        ]);

        $category->update($validated);

        $category->loadCount('events');
        $category->status = $category->events_count > 0;

        return response()->json([
            'message' => 'Event category updated successfully',
            'category' => $category,
        ], 200);
    }

    // Delete category
    public function destroy($id)
    {
        $category = EventCategory::find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Event category not found',
            ], 404);
        }

        // Prevent deleting a category that is still used by events
        if ($category->events()->exists()) {
            return response()->json([
                'message' => 'Cannot delete a category that has events.',
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Event category deleted successfully',
        ], 200);
    }
}