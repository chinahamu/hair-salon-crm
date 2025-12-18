<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Staff;
use App\Models\Store;
use App\Models\Shift;
use Carbon\Carbon;

class ShiftSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Target Staff A
        $staff = Staff::where('email', 'staff-a@example.com')->first();
        
        if (!$staff) {
            $this->command->warn('Staff A not found. Skipping ShiftSeeder.');
            return;
        }

        // Target Store A1
        // Assuming Staff A belongs to Organization A, and Store A1 is in Organization A.
        // We can look up Store A1 directly by email or name as defined in OrganizationSeeder
        $store = Store::where('email', 'test@example.com')->first();

        if (!$store) {
            $this->command->warn('Store A1 not found. Skipping ShiftSeeder.');
            return;
        }

        // Configuration
        $startDate = Carbon::today();
        $endDate = $startDate->copy()->addYear();
        $holidays = ['Mon', 'Tue']; // Store A1 holidays
        $startTimeStr = '10:00';
        $endTimeStr = '19:00'; // 9 hour shift

        // Generate Shifts
        $currentDate = $startDate->copy();
        $shiftsToCreate = [];

        while ($currentDate <= $endDate) {
            // Check if current day is a holiday
            // Carbon dayOfWeek: 0 (Sun) - 6 (Sat)
            // Mon=1, Tue=2
            $dayOfWeek = $currentDate->format('D'); // Mon, Tue, ...

            if (!in_array($dayOfWeek, $holidays)) {
                $start = $currentDate->copy()->setTimeFromTimeString($startTimeStr);
                $end = $currentDate->copy()->setTimeFromTimeString($endTimeStr);

                $shiftsToCreate[] = [
                    'staff_id' => $staff->id,
                    'store_id' => $store->id,
                    'start_time' => $start,
                    'end_time' => $end,
                    'status' => 'active',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            $currentDate->addDay();
        }

        // Bulk insert for performance
        // chunking to be safe
        foreach (array_chunk($shiftsToCreate, 100) as $chunk) {
            Shift::insert($chunk);
        }

        $this->command->info('Created ' . count($shiftsToCreate) . ' shifts for Staff A at Store A1.');
    }
}
