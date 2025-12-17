<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Staff;
use App\Models\Shift;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class ReservationController extends Controller
{
    public function create()
    {
        // For simplicity, let's assume we list all stores? Or the user navigates from a store page.
        // Let's pass all stores for now.
        $stores = \App\Models\Store::all();
        $staff = \App\Models\Staff::all(); // Should be filtered by store selected in UI dynamically?
        // Better: The UI loads stores. When store selected, maybe fetch staff?
        // For MVP, just pass everything or rely on frontend to filter if small data.
        // Or simple: Just render the page.
        
        return Inertia::render('Reservation/Create', [
            'stores' => $stores,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'staff_id' => 'nullable|exists:staff,id',
            'is_nominated' => 'boolean',
        ]);

        $staffId = $validated['staff_id'] ?? null;
        $isNominated = $validated['is_nominated'] ?? false;
        $storeId = $validated['store_id'];
        $startTime = $validated['start_time'];
        $endTime = $validated['end_time'];

        if ($isNominated && $staffId) {
            // Check specific staff availability
            $isAvailable = Staff::where('id', $staffId)
                ->available($storeId, $startTime, $endTime)
                ->exists();

            if (!$isAvailable) {
                throw ValidationException::withMessages([
                    'staff_id' => 'The selected staff is not available at this time.',
                ]);
            }
        } else {
            // Find any available staff
            $availableStaff = Staff::available($storeId, $startTime, $endTime)->first();

            if (!$availableStaff) {
                 throw ValidationException::withMessages([
                    'start_time' => 'No staff available at this time.',
                ]);
            }
            $staffId = $availableStaff->id;
        }

        Reservation::create([
            'user_id' => Auth::id(), // Assuming customer is logged in User
            'staff_id' => $staffId,
            'store_id' => $storeId,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'is_nominated' => $isNominated,
            'status' => 'confirmed',
        ]);

        return redirect()->back()->with('success', 'Reservation created successfully.');
    }
}
