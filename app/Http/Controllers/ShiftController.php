<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ShiftController extends Controller
{
    public function index(Request $request)
    {
        // TODO: Implement filtering by date range
        $store = Auth::user()->organization->stores->first();
        $shifts = Shift::with(['staff', 'store'])
            ->where('store_id', $store->id) 
            ->get();

        $staffList = Auth::user()->organization->staff;

        return Inertia::render('Staff/Shifts/Index', [
            'shifts' => $shifts,
            'staffList' => $staffList,
            'store' => $store,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'staff_id' => 'required|exists:staff,id',
            'store_id' => 'required|exists:stores,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        Shift::create($validated);

        return redirect()->back();
    }

    public function destroy(Shift $shift)
    {
        $shift->delete();

        return redirect()->back();
    }
}
