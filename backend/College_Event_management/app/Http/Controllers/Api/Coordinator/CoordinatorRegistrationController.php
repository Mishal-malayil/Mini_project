<?php

namespace App\Http\Controllers\Api\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\Registration;
use Illuminate\Http\Request;

class CoordinatorRegistrationController extends Controller
{
    // =====================================================
    // VIEW ONLY REGISTRATIONS FOR LOGGED-IN COORDINATOR
    // =====================================================

    public function index()
    {
        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        $registrations = Registration::with([
            'student',
            'event'
        ])
        ->whereHas('event', function ($query) use ($coordinator) {

            $query->where(
                'coordinator_id',
                $coordinator->id
            );

        })
        ->latest()
        ->get();

        return response()->json($registrations);
    }


    // =====================================================
    // VIEW ONE REGISTRATION
    // =====================================================

    public function show($id)
    {
        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        $registration = Registration::with([
            'student',
            'event'
        ])
        ->where('id', $id)
        ->whereHas('event', function ($query) use ($coordinator) {

            $query->where(
                'coordinator_id',
                $coordinator->id
            );

        })
        ->first();

        if (!$registration) {
            return response()->json([
                'message' => 'Registration not found'
            ], 404);
        }

        return response()->json($registration);
    }


    // =====================================================
    // APPROVE REGISTRATION
    // =====================================================

    public function approve($id)
    {
        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        $registration = Registration::where('id', $id)
            ->whereHas('event', function ($query) use ($coordinator) {

                $query->where(
                    'coordinator_id',
                    $coordinator->id
                );

            })
            ->first();

        if (!$registration) {
            return response()->json([
                'message' => 'Registration not found'
            ], 404);
        }

        $registration->update([
            'status' => 'Approved'
        ]);

        return response()->json([
            'message' => 'Registration approved successfully',
            'registration' => $registration
        ]);
    }


    // =====================================================
    // REJECT REGISTRATION
    // =====================================================

    public function reject($id)
    {
        $coordinator = auth('coordinator')->user();

        if (!$coordinator) {
            return response()->json([
                'message' => 'Coordinator not authenticated'
            ], 401);
        }

        $registration = Registration::where('id', $id)
            ->whereHas('event', function ($query) use ($coordinator) {

                $query->where(
                    'coordinator_id',
                    $coordinator->id
                );

            })
            ->first();

        if (!$registration) {
            return response()->json([
                'message' => 'Registration not found'
            ], 404);
        }

        $registration->update([
            'status' => 'Rejected'
        ]);

        return response()->json([
            'message' => 'Registration rejected successfully',
            'registration' => $registration
        ]);
    }
}