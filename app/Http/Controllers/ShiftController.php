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
        $user = Auth::user();
        $organizationId = $user->organization_id;

        $query = Shift::with(['staff', 'store'])
            ->whereHas('store', function ($q) use ($organizationId) {
                $q->where('organization_id', $organizationId);
            });

        // Exact date filter (Legacy/List view)
        if ($request->filled('date')) {
            $query->whereDate('start_time', $request->date);
        }

        // Date Range Filter (For Calendar Views)
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->where(function($q) use ($request) {
                 $q->whereBetween('start_time', [$request->start_date, $request->end_date])
                   ->orWhereBetween('end_time', [$request->start_date, $request->end_date]);
            });
        }

        if ($request->filled('store_id')) {
            $query->where('store_id', $request->store_id);
        }

        if ($request->filled('staff_id')) {
            $query->where('staff_id', $request->staff_id);
        }

        // If 'all' is requested for calendar:
        if ($request->filled('get_all')) {
            $shifts = $query->orderBy('start_time', 'asc')->get();
        } else {
            $shifts = $query->orderBy('start_time', 'desc')->paginate(20)->withQueryString();
        }

        $stores = $user->organization->stores;
        $staffList = $user->organization->staff;

        return Inertia::render('Staff/Shifts/Index', [
            'shifts' => $shifts,
            'staffList' => $staffList,
            'stores' => $stores,
            'filters' => $request->only(['date', 'store_id', 'staff_id', 'start_date', 'end_date', 'view_mode']),
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
