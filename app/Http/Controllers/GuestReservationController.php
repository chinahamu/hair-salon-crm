<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\Shift;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class GuestReservationController extends Controller
{
    public function index(Request $request, $store_code)
    {
        $store = Store::where('store_code', $store_code)->firstOrFail();

        return Inertia::render('Guest/Reserve/Index', [
            'store' => $store,
        ]);
    }

    public function getAvailability(Request $request, $store_code)
    {
        $request->validate([
            'date' => 'required|date',
        ]);

        $store = Store::where('store_code', $store_code)->firstOrFail();
        $date = Carbon::parse($request->input('date'));
        $dateStr = $date->format('Y-m-d');

        // Check Regular Holidays
        // Store saves holidays as ['Mon', 'Tue']
        $dayOfWeek = $date->format('D');
        $regularHolidays = $store->regular_holidays ?? [];
        if (in_array($dayOfWeek, $regularHolidays)) {
            return response()->json([
                'status' => 'closed',
                'reason' => 'regular_holiday',
                'slots' => []
            ]);
        }

        // Check Temporary Closures
        // Store saves closures as ['2023-01-01', ...]
        $temporaryClosures = $store->temporary_closures ?? [];
        if (in_array($dateStr, $temporaryClosures)) {
            return response()->json([
                'status' => 'closed',
                'reason' => 'temporary_closure',
                'slots' => []
            ]);
        }

        // Business Hours
        $businessHours = $store->business_hours;
        if (!$businessHours || !isset($businessHours['start']) || !isset($businessHours['end'])) {
            // Default or Error? Let's assume closed if not set, or default 09:00-18:00
            $startTime = '09:00';
            $endTime = '18:00';
        } else {
            $startTime = $businessHours['start'];
            $endTime = $businessHours['end'];
        }

        $openTime = Carbon::parse("$dateStr $startTime");
        $closeTime = Carbon::parse("$dateStr $endTime");
        $interval = $store->min_reservation_unit ?? 30;

        // Fetch Shifts for this day
        // We look for shifts that overlap with the business hours of this day
        $shifts = Shift::where('store_id', $store->id)
            ->where('start_time', '<', $closeTime)
            ->where('end_time', '>', $openTime)
            ->get();

        // Fetch Reservations for this day
        $reservations = Reservation::where('store_id', $store->id)
            ->where('start_time', '<', $closeTime)
            ->where('end_time', '>', $openTime)
            ->where('status', '!=', 'cancelled')
            ->get();

        $slots = [];
        $current = $openTime->copy();

        while ($current->copy()->addMinutes($interval) <= $closeTime) {
            $slotStart = $current->copy();
            $slotEnd = $current->copy()->addMinutes($interval);

            // Staff available: Active shift covering this slot
            $staffCount = $shifts->filter(function ($shift) use ($slotStart, $slotEnd) {
                return $shift->start_time <= $slotStart && $shift->end_time >= $slotEnd;
            })->count();

            // Reservations taken: Overlapping this slot
            $reservationCount = $reservations->filter(function ($res) use ($slotStart, $slotEnd) {
                return $res->start_time < $slotEnd && $res->end_time > $slotStart;
            })->count();

            $remaining = $staffCount - $reservationCount;
            // Cap at 0
            if ($remaining < 0) $remaining = 0;

            $slots[] = [
                'time' => $slotStart->format('H:i'),
                'available' => $remaining > 0,
                'remaining' => $remaining
            ];

            $current->addMinutes($interval);
        }

        return response()->json([
            'status' => 'open',
            'slots' => $slots
        ]);
    }

    public function step2Menu(Request $request, $store_code)
    {
        $request->validate([
            'date' => 'required|date',
            'time' => 'required', // Format: HH:MM
        ]);

        $store = Store::where('store_code', $store_code)->firstOrFail();
        $menus = $store->menus()->where('status', true)->get();

        return Inertia::render('Guest/Reserve/Menu', [
            'store' => $store,
            'menus' => $menus,
            'date' => $request->date,
            'time' => $request->time,
        ]);
    }

    public function step3Staff(Request $request, $store_code)
    {
        $request->validate([
            'date' => 'required|date',
            'time' => 'required',
            'menu_ids' => 'required|array',
            'menu_ids.*' => 'exists:menus,id',
        ]);

        $store = Store::where('store_code', $store_code)->firstOrFail();
        $menus = \App\Models\Menu::whereIn('id', $request->menu_ids)->get();

        // Calculate total duration
        $totalDuration = $menus->sum('duration');
        // Calculate price for view
        $totalPrice = $menus->sum('price');

        // Determine Start and End Time
        $startDateTime = Carbon::parse($request->date . ' ' . $request->time);
        $endDateTime = $startDateTime->copy()->addMinutes($totalDuration);

        // Find Available Staff
        // We use the scopeAvailable logic (or manual query)
        // We need staff who have an ACTIVE shift covering the entirity of [start, end]
        // AND do not have any CONFIRMED reservation overlapping [start, end]

        $availableStaff = \App\Models\Staff::whereHas('shifts', function ($q) use ($store, $startDateTime, $endDateTime) {
            $q->where('store_id', $store->id)
              ->where('start_time', '<=', $startDateTime)
              ->where('end_time', '>=', $endDateTime)
              ->where('status', '!=', 'cancelled'); // Assuming status logic, default migration didn't have status enum but string
        })->whereDoesntHave('reservations', function ($q) use ($startDateTime, $endDateTime) {
            $q->where('status', '!=', 'cancelled')
              ->where(function ($query) use ($startDateTime, $endDateTime) {
                  $query->whereBetween('start_time', [$startDateTime, $endDateTime])
                        ->orWhereBetween('end_time', [$startDateTime, $endDateTime])
                        ->orWhere(function ($sub) use ($startDateTime, $endDateTime) {
                            $sub->where('start_time', '<=', $startDateTime)
                                ->where('end_time', '>=', $endDateTime);
                        });
              });
        })->get();

        return Inertia::render('Guest/Reserve/Staff', [
            'store' => $store,
            'date' => $request->date,
            'time' => $request->time,
            'menus' => $menus, // Pass full menu objects for display
            'totalPrice' => $totalPrice,
            'totalDuration' => $totalDuration,
            'availableStaff' => $availableStaff,
        ]);
    }

    public function step4Confirm(Request $request, $store_code)
    {
        $request->validate([
            'date' => 'required|date',
            'time' => 'required',
            'menu_ids' => 'required|array',
            'staff_id' => 'nullable|exists:staff,id',
        ]);

        $store = Store::where('store_code', $store_code)->firstOrFail();
        $menus = \App\Models\Menu::whereIn('id', $request->menu_ids)->get();
        $staff = $request->staff_id ? \App\Models\Staff::find($request->staff_id) : null;

        $totalDuration = $menus->sum('duration');
        $totalPrice = $menus->sum('price');
        
        return Inertia::render('Guest/Reserve/Confirm', [
            'store' => $store,
            'date' => $request->date,
            'time' => $request->time,
            'menus' => $menus,
            'staff' => $staff,
            'totalDuration' => $totalDuration,
            'totalPrice' => $totalPrice,
            'auth_user' => \Illuminate\Support\Facades\Auth::user()
        ]);
    }

    public function store(Request $request, $store_code)
    {
        $request->validate([
            'date' => 'required|date',
            'time' => 'required',
            'menu_ids' => 'required|array',
            'staff_id' => 'nullable|exists:staff,id',
            'action_type' => 'required|in:login,register,logged_in',
            // Validation rules are conditional
            'email' => 'required_if:action_type,login,register|email',
            'password' => 'required_if:action_type,login,register',
            'name' => 'required_if:action_type,register',
            'phone' => 'required_if:action_type,register',
        ]);

        $store = Store::where('store_code', $store_code)->firstOrFail();

        // 1. Authenticate or Register User
        if ($request->action_type === 'register') {
            $user = \App\Models\User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            ]);
            \Illuminate\Support\Facades\Auth::login($user);
        } elseif ($request->action_type === 'login') {
            $credentials = $request->only('email', 'password');
            if (!\Illuminate\Support\Facades\Auth::attempt($credentials)) {
                return back()->withErrors(['email' => '認証情報が正しくありません。']);
            }
        } elseif ($request->action_type === 'logged_in') {
            if (!\Illuminate\Support\Facades\Auth::check()) {
                 return back()->withErrors(['message' => 'ログインセッションが切れました。再度ログインしてください。']);
            }
        }

        $user = \Illuminate\Support\Facades\Auth::user();

        // 2. Create Reservation
        $menus = \App\Models\Menu::whereIn('id', $request->menu_ids)->get();
        $totalDuration = $menus->sum('duration');
        $startDateTime = Carbon::parse($request->date . ' ' . $request->time);
        $endDateTime = $startDateTime->copy()->addMinutes($totalDuration);

        $reservation = Reservation::create([
            'user_id' => $user->id,
            'store_id' => $store->id,
            'staff_id' => $request->staff_id, // Nullable
            'start_time' => $startDateTime,
            'end_time' => $endDateTime,
            'is_nominated' => !is_null($request->staff_id),
            'status' => 'confirmed', 
        ]);

        // Attach Menus
        $reservation->menus()->attach($request->menu_ids, [
            'price' => 0, // Pivot data, maybe copy current price?
            'duration' => 0 // Pivot data
        ]);
        // Update pivot with actual data
        foreach ($menus as $menu) {
             $reservation->menus()->updateExistingPivot($menu->id, [
                 'price' => $menu->price,
                 'duration' => $menu->duration
             ]);
        }
        
        return redirect()->route('guest.reservation.complete', ['store_code' => $store_code]);
    }

    public function complete(Request $request, $store_code)
    {
        $store = Store::where('store_code', $store_code)->firstOrFail();
        return Inertia::render('Guest/Reserve/Complete', [
            'store' => $store
        ]);
    }
}
