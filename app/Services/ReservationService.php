<?php

namespace App\Services;

use App\Models\Reservation;
use App\Models\Store;
use App\Models\Menu;
use App\Models\MenuFacilityRequirement;
use Carbon\Carbon;

class ReservationService
{
    /**
     * Check if the requested reservation slot is available given the resource constraints.
     *
     * @param int $storeId
     * @param string|Carbon $startTime
     * @param string|Carbon $endTime
     * @param array $menuIds
     * @param int|null $excludeReservationId Exclude a reservation (for updates)
     * @return bool
     */
    public function isSlotAvailable(int $storeId, $startTime, $endTime, array $menuIds, ?int $excludeReservationId = null): bool
    {
        $start = Carbon::parse($startTime);
        $end = Carbon::parse($endTime);

        // 1. Get Store Capacity (Facilities count by type)
        // We assume 'active' facilities are available.
        // Group by type and count.
        $store = Store::with('facilities')->find($storeId);
        if (!$store) {
            return false;
        }

        $capacities = $store->facilities
            ->where('status', 'active')
            ->groupBy('type')
            ->map(function ($facilities) {
                return $facilities->count();
            });

        // 2. Calculate Requirements for the requested menus
        $requestedRequirements = $this->calculateRequirements($menuIds);

        // Quick check: If requested > capacity, fail immediately
        foreach ($requestedRequirements as $type => $qty) {
            if ($qty > ($capacities[$type] ?? 0)) {
                return false;
            }
        }

        // 3. Find overlapping reservations
        $query = Reservation::where('store_id', $storeId)
            ->where('status', '!=', 'cancelled')
            ->where(function ($q) use ($start, $end) {
                $q->where('start_time', '<', $end)
                  ->where('end_time', '>', $start);
            });

        if ($excludeReservationId) {
            $query->where('id', '!=', $excludeReservationId);
        }

        $overlappingReservations = $query->with('menus.facilityRequirements')->get();

        if ($overlappingReservations->isEmpty()) {
            return true;
        }

        // 4. Build Timeline to check Peak Usage
        // We need to check usage at every point where usage changes, within the window.
        // Relevant time points are:
        // - The requested start time.
        // - The start/end times of any overlapping reservation that fall within (start, end).
        
        $timePoints = collect([$start]);
        
        foreach ($overlappingReservations as $reservation) {
             $rStart = Carbon::parse($reservation->start_time);
             $rEnd = Carbon::parse($reservation->end_time);
             
             if ($rStart->gt($start) && $rStart->lt($end)) {
                 $timePoints->push($rStart);
             }
             if ($rEnd->gt($start) && $rEnd->lt($end)) {
                 $timePoints->push($rEnd);
             }
        }
        
        $timePoints = $timePoints->unique()->sort()->values();

        // Check usage at each relevant time point (start of each segment)
        foreach ($timePoints as $time) {
            // Calculate usage at exactly $time.
            // Note: Since we use [start, end), a reservation ending at $time is NOT active.
            // A reservation starting at $time IS active.
            
            $currentUsage = [];
            
            // Add requested usage (it applies for the whole window)
            foreach ($requestedRequirements as $type => $qty) {
                $currentUsage[$type] = ($currentUsage[$type] ?? 0) + $qty;
            }

            // Add usage from overlapping reservations active at $time
            foreach ($overlappingReservations as $reservation) {
                $rStart = Carbon::parse($reservation->start_time);
                $rEnd = Carbon::parse($reservation->end_time);
                
                // Active if rStart <= time < rEnd
                if ($rStart->lte($time) && $rEnd->gt($time)) {
                    $resReqs = $this->calculateRequirementsForReservation($reservation);
                    foreach ($resReqs as $type => $qty) {
                        $currentUsage[$type] = ($currentUsage[$type] ?? 0) + $qty;
                    }
                }
            }

            // Verify against capacity
            foreach ($currentUsage as $type => $usage) {
                if ($usage > ($capacities[$type] ?? 0)) {
                    return false;
                }
            }
        }

        return true;
    }

    private function calculateRequirements(array $menuIds): array
    {
        $requirements = [];
        $menus = Menu::whereIn('id', $menuIds)->with('facilityRequirements')->get();

        foreach ($menus as $menu) {
            foreach ($menu->facilityRequirements as $req) {
                $requirements[$req->facility_type] = ($requirements[$req->facility_type] ?? 0) + $req->quantity;
            }
        }
        return $requirements;
    }

    private function calculateRequirementsForReservation(Reservation $reservation): array
    {
        $requirements = [];
        foreach ($reservation->menus as $menu) {
            foreach ($menu->facilityRequirements as $req) {
                 $requirements[$req->facility_type] = ($requirements[$req->facility_type] ?? 0) + $req->quantity;
            }
        }
        return $requirements;
    }
}
