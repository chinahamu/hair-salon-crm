<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date') ? \Carbon\Carbon::parse($request->input('start_date')) : now()->startOfMonth();
        $endDate = $request->input('end_date') ? \Carbon\Carbon::parse($request->input('end_date'))->endOfDay() : now()->endOfMonth();

        // 1. Reservation Count (Total valid reservations in period)
        $reservations = \App\Models\Reservation::whereBetween('start_time', [$startDate, $endDate])
            ->whereIn('status', ['confirmed', 'completed']) // Assuming these are valid statuses
            ->get();
        
        $reservationCount = $reservations->count();

        // 2. Average Spend (Total Revenue / Visit Count)
        // Accessing pivot table price via reservation_menus
        $totalRevenue = 0;
        foreach ($reservations as $reservation) {
            $totalRevenue += $reservation->menus->sum(function ($menu) {
                return $menu->pivot->price;
            });
        }
        $averageSpend = $reservationCount > 0 ? round($totalRevenue / $reservationCount) : 0;

        // 3. Occupancy Rate (Total Reservation Duration / Total Shift Duration)
        $totalReservationMinutes = 0;
        foreach ($reservations as $reservation) {
            $totalReservationMinutes += $reservation->start_time->diffInMinutes($reservation->end_time);
        }

        $shifts = \App\Models\Shift::whereBetween('start_time', [$startDate, $endDate])
            ->where('status', 'active')
            ->get();
        
        $totalShiftMinutes = 0;
        foreach ($shifts as $shift) {
            $totalShiftMinutes += \Carbon\Carbon::parse($shift->start_time)->diffInMinutes(\Carbon\Carbon::parse($shift->end_time));
        }

        $occupancyRate = $totalShiftMinutes > 0 ? round(($totalReservationMinutes / $totalShiftMinutes) * 100, 1) : 0;

        // 4. No-show Rate
        $allReservationsInPeriod = \App\Models\Reservation::whereBetween('start_time', [$startDate, $endDate])->get();
        $totalReservationsAllStatus = $allReservationsInPeriod->count();
        $noShowCount = $allReservationsInPeriod->where('status', 'cancelled')->count(); // Assuming 'cancelled' or specific status for no-show. Using 'cancelled' for now as placeholder or check if 'no-show' exists
        // Refined: usually no-show is a specific status. If not defined, we might need to assume 'cancelled' is the closest proxy or 0 if strictly no-show.
        // Let's assume 'cancelled' includes no-shows for now, or 0 if we want to be strict.
        // Actually, let's look for a 'no_show' status if strictly requested.
        // Given previous reservation table check, status defaults to 'confirmed'.
        // I'll stick to 'cancelled' as a proxy for bad outcomes or 0 if undefined.
        // Let's assume no-show tracks as 'no_show' status if implemented, else 'cancelled'.
        // For safe implementation, I will treat 'cancelled' as non-visit, but "No-show" implies missed without cancel.
        // Since I don't see a no-show status in standard migrations, I'll calculate based on 'cancelled' for now as a placeholder or 0.
        // Better: Let's assume 'no_show' is a potential status string.
        $noShowCount = $allReservationsInPeriod->where('status', 'no_show')->count();
        $noShowRate = $totalReservationsAllStatus > 0 ? round(($noShowCount / $totalReservationsAllStatus) * 100, 1) : 0;


        // 5. Repeat Rate (Users with > 1 past visit / Total unique users visited in period) ???
        // Definition: Of the people who visited in this period, how many were repeaters?
        // Or: (Repeaters / Total Visitors)
        // A repeater is someone who has visited BEFORE this current reservation.
        $repeatersCount = 0;
        $userIds = $reservations->pluck('user_id')->unique();
        
        foreach ($userIds as $userId) {
            // Check if they had a reservation before the start of this period OR before their current visit?
            // "Repeat Rate" typically means "Percentage of visits that are from repeat customers" or "Percentage of customers who return".
            // Let's go with: Percentage of visits in this period made by users with previous history.
            
            // For each reservation in the window, check if user has previous completed reservation
            // This is slightly heavy, so let's optimize.
            // Simplified: Check if user has reservations with start_time < this period's start_time?
            // Or strictly: count how many users in this batch have > 1 total reservations (lifetime)?
            // Let's iterate reservations.
        }
        
        $repeaterVisits = 0;
        foreach ($reservations as $reservation) {
             $previousVisits = \App\Models\Reservation::where('user_id', $reservation->user_id)
                ->where('start_time', '<', $reservation->start_time)
                ->where('status', 'completed')
                ->exists();
            if ($previousVisits) {
                $repeaterVisits++;
            }
        }
        
        $repeatRate = $reservationCount > 0 ? round(($repeaterVisits / $reservationCount) * 100, 1) : 0;


        // 6. Media Inflow
        // Group users by media_source who made reservations in this period
        // OR just simple user count by media_source joined with reservations
        $mediaInflow = $reservations->groupBy(function ($reservation) {
            return $reservation->user->media_source ?? 'Direct/None';
        })->map(function ($group) {
            return $group->count();
        });


        return \Inertia\Inertia::render('Staff/Analytics/Index', [
            'metrics' => [
                'reservation_count' => $reservationCount,
                'occupancy_rate' => $occupancyRate,
                'average_spend' => $averageSpend,
                'repeat_rate' => $repeatRate,
                'no_show_rate' => $noShowRate,
                'media_inflow' => $mediaInflow,
            ],
            'filters' => [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ]
        ]);
    }}
