<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Reservation;
use App\Models\Staff;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::guard('staff')->user();
        $organizationId = $user->organization_id;

        $query = Reservation::with(['user', 'staff', 'store', 'menus'])
            ->whereHas('store', function ($q) use ($organizationId) {
                $q->where('organization_id', $organizationId);
            });

        if ($request->filled('date')) {
            $query->whereDate('start_time', $request->date);
        }

        if ($request->filled('store_id')) {
            $query->where('store_id', $request->store_id);
        }
        
        // Default to upcoming reservations unless filtered?
        // Let's order by start_time desc for now.
        $reservations = $query->orderBy('start_time', 'desc')->paginate(10)->withQueryString();

        $stores = Store::where('organization_id', $organizationId)->get();

        return Inertia::render('Staff/Reservations/Index', [
            'reservations' => $reservations,
            'stores' => $stores,
            'filters' => $request->only(['date', 'store_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::guard('staff')->user();
        $organizationId = $user->organization_id;

        $stores = Store::where('organization_id', $organizationId)->with('menus')->get();
        // Ideally users should be searched via API, but for MVP fetching all.
        // Be careful with large user base.
        $users = User::all(); 
        $staffs = Staff::where('organization_id', $organizationId)->get();

        return Inertia::render('Staff/Reservations/Create', [
            'stores' => $stores,
            'users' => $users,
            'staffs' => $staffs,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'store_id' => 'required|exists:stores,id',
            'staff_id' => 'nullable|exists:staff,id',
            'menu_ids' => 'required|array',
            'menu_ids.*' => 'exists:menus,id',
            'start_time' => 'required|date',
            'is_nominated' => 'boolean',
        ]);

        $store = Store::findOrFail($validated['store_id']);
        
        // Calculate end_time based on menus
        $menus = Menu::whereIn('id', $validated['menu_ids'])->get();
        $totalDuration = $menus->sum('duration');
        
        $startTime = \Carbon\Carbon::parse($validated['start_time']);
        $endTime = $startTime->copy()->addMinutes($totalDuration);

        $staffId = $validated['staff_id'] ?? null;
        $isNominated = $validated['is_nominated'] ?? false;

        // Availability Check
        if ($staffId) {
             // Check specific staff availability
             // NOTE: Staff::available scope existence was confirmed in finding step.
            $isAvailable = Staff::where('id', $staffId)
                ->available($store->id, $startTime, $endTime)
                ->exists();

            if (!$isAvailable) {
                // For manual override by staff, maybe we allow it with a warning? 
                // For now, strict check as per plan.
                throw ValidationException::withMessages([
                    'staff_id' => 'The selected staff is not available at this time.',
                ]);
            }
        } else {
             // Find any available staff
            $availableStaff = Staff::where('organization_id', Auth::guard('staff')->user()->organization_id)
                ->available($store->id, $startTime, $endTime)
                ->first();

            if (!$availableStaff) {
                 throw ValidationException::withMessages([
                    'start_time' => 'No staff available at this time.',
                ]);
            }
            $staffId = $availableStaff->id;
        }

        $reservation = Reservation::create([
            'user_id' => $validated['user_id'],
            'staff_id' => $staffId,
            'store_id' => $validated['store_id'],
            'start_time' => $startTime,
            'end_time' => $endTime,
            'is_nominated' => $isNominated,
            'status' => 'confirmed',
        ]);

        // Attach menus
        foreach ($menus as $menu) {
            $reservation->menus()->attach($menu->id, [
                'price' => $menu->price,
                'duration' => $menu->duration,
            ]);
        }

        return redirect()->route('staff.reservations.index')->with('success', 'Reservation created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Reservation $reservation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reservation $reservation)
    {
        $user = Auth::guard('staff')->user();
        // Ensure reservation belongs to organization
        if ($reservation->store->organization_id !== $user->organization_id) {
            abort(403);
        }

        $reservation->load(['menus', 'store']);

        $stores = Store::where('organization_id', $user->organization_id)->with('menus')->get();
        $users = User::all();
        $staffs = Staff::where('organization_id', $user->organization_id)->get();

        return Inertia::render('Staff/Reservations/Edit', [
            'reservation' => $reservation,
            'stores' => $stores,
            'users' => $users,
            'staffs' => $staffs,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'store_id' => 'required|exists:stores,id',
            'staff_id' => 'nullable|exists:staff,id',
            'menu_ids' => 'required|array',
            'menu_ids.*' => 'exists:menus,id',
            'start_time' => 'required|date',
            'is_nominated' => 'boolean',
            'status' => 'required|string|in:confirmed,cancelled,completed',
        ]);

        $store = Store::findOrFail($validated['store_id']);
        
        $menus = Menu::whereIn('id', $validated['menu_ids'])->get();
        $totalDuration = $menus->sum('duration');
        
        $startTime = \Carbon\Carbon::parse($validated['start_time']);
        $endTime = $startTime->copy()->addMinutes($totalDuration);

        $staffId = $validated['staff_id'] ?? null;
        $isNominated = $validated['is_nominated'] ?? false;
        
        // We might simply update without strict availability check on update? 
        // Or re-check availability if time/staff changed?
        // Let's re-check if time or staff changed.
        $needsCheck = $reservation->start_time != $startTime || 
                      $reservation->end_time != $endTime || 
                      $reservation->staff_id != $staffId;

        if ($needsCheck && $validated['status'] !== 'cancelled') {
             if ($staffId) {
                // Exclude current reservation from check if checking same staff/time?
                // Actually 'available' scope checks for overlaps. We need to exclude THIS reservation.
                // The 'available' scope in Staff model: `whereDoesntHave('reservations', ...)`
                // We can't easily modify the scope.
                // Let's just run the check. If it fails, we check if the conflicting reservation is THIS one.
                
                // For simplicity in this MVP step, I will skip complex "exclude self" logic in scope 
                // and just trust the staff member overrides or simple check.
                // Actually, let's implement a quick check.
                
                // Re-implementing availability check manually to exclude current ID
                $hasConflict = Reservation::where('staff_id', $staffId)
                    ->where('id', '!=', $reservation->id)
                    ->where('status', 'confirmed')
                    ->where(function ($q) use ($startTime, $endTime) {
                         $q->whereBetween('start_time', [$startTime, $endTime])
                           ->orWhereBetween('end_time', [$startTime, $endTime])
                           ->orWhere(function ($q2) use ($startTime, $endTime) {
                               $q2->where('start_time', '<', $startTime)
                                 ->where('end_time', '>', $endTime);
                           });
                    })->exists();

                if ($hasConflict) {
                     throw ValidationException::withMessages([
                        'staff_id' => 'The selected staff has another reservation at this time.',
                    ]);
                }
                
                // Also check Shift
                $hasShift = Staff::find($staffId)->shifts()
                    ->where('store_id', $store->id)
                    ->where('start_time', '<=', $startTime)
                    ->where('end_time', '>=', $endTime)
                    ->where('status', 'active')
                    ->exists();

                 if (!$hasShift) {
                     throw ValidationException::withMessages([
                        'staff_id' => 'The selected staff does not have a shift at this time.',
                    ]);
                }

            }
        }

        $reservation->update([
            'user_id' => $validated['user_id'],
            'staff_id' => $staffId,
            'store_id' => $validated['store_id'],
            'start_time' => $startTime,
            'end_time' => $endTime,
            'is_nominated' => $isNominated,
            'status' => $validated['status'],
        ]);

        // Sync Menus
        // Prepare sync data with pivot
        $syncData = [];
        foreach ($menus as $menu) {
            $syncData[$menu->id] = ['price' => $menu->price, 'duration' => $menu->duration];
        }
        $reservation->menus()->sync($syncData);

        return redirect()->route('staff.reservations.index')->with('success', 'Reservation updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservation $reservation)
    {
        // Helper to just cancel
        $reservation->update(['status' => 'cancelled']);
        return redirect()->route('staff.reservations.index')->with('success', 'Reservation cancelled.');
    }
}
