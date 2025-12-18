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
}
