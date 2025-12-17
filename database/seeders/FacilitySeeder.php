<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FacilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stores = \App\Models\Store::all();

        foreach ($stores as $store) {
            // Check if facilities already exist to avoid duplication
            if ($store->facilities()->exists()) {
                continue;
            }

            // Create Seats
            for ($i = 1; $i <= 3; $i++) {
                \App\Models\Facility::create([
                    'store_id' => $store->id,
                    'name' => "Set Surface {$i}",
                    'type' => 'seat',
                    'status' => 'active',
                ]);
            }

            // Create Shampoo Stations
            for ($i = 1; $i <= 2; $i++) {
                \App\Models\Facility::create([
                    'store_id' => $store->id,
                    'name' => "Shampoo Station " . chr(64 + $i), // A, B
                    'type' => 'shampoo_station',
                    'status' => 'active',
                ]);
            }

            // Create Private Room
            \App\Models\Facility::create([
                'store_id' => $store->id,
                'name' => "Private Room 1",
                'type' => 'private_room',
                'status' => 'active',
            ]);
        }
    }
}
