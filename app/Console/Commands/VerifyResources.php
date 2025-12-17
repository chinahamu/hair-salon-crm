<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class VerifyResources extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'verify:resources';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verify resource management logic';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting Verification...');

        // Setup Data
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        \Illuminate\Support\Facades\DB::table('reservation_menus')->truncate();
        \App\Models\Reservation::truncate();
        \App\Models\MenuFacilityRequirement::truncate();
        \App\Models\Menu::truncate();
        \App\Models\Facility::truncate();
        \App\Models\Store::truncate();
        \App\Models\Organization::truncate();
        \App\Models\User::truncate(); // If needed for foreign keys
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Create User
        $user = \App\Models\User::factory()->create();

        // Create Organization
        $org = \App\Models\Organization::create(['name' => 'Test Org']);

        // Create Store
        $store = \App\Models\Store::create([
            'name' => 'Test Store',
            'organization_id' => $org->id,
            'address' => '123 Test St',
            'phone' => '000-0000-0000',
            'email' => 'test@example.com',
        ]);
        
        // Create Facilities: 2 Seats, 1 Shampoo
        \App\Models\Facility::create(['store_id' => $store->id, 'name' => 'Seat 1', 'type' => 'seat', 'status' => 'active']);
        \App\Models\Facility::create(['store_id' => $store->id, 'name' => 'Seat 2', 'type' => 'seat', 'status' => 'active']);
        \App\Models\Facility::create(['store_id' => $store->id, 'name' => 'Shampoo 1', 'type' => 'shampoo', 'status' => 'active']);

        // Create Menus
        $cut = \App\Models\Menu::create([
            'store_id' => $store->id,
            'name' => 'Cut',
            'price' => 5000,
            'duration' => 60,
        ]);
        \App\Models\MenuFacilityRequirement::create(['menu_id' => $cut->id, 'facility_type' => 'seat', 'quantity' => 1]);

        $spa = \App\Models\Menu::create([
            'store_id' => $store->id,
            'name' => 'Spa',
            'price' => 3000,
            'duration' => 30,
        ]);
        \App\Models\MenuFacilityRequirement::create(['menu_id' => $spa->id, 'facility_type' => 'shampoo', 'quantity' => 1]);


        $service = new \App\Services\ReservationService();
        $start = '2025-01-01 10:00:00';
        $end = '2025-01-01 11:00:00';

        // TEST 1: Book Cut (Expect True)
        $avail = $service->isSlotAvailable($store->id, $start, $end, [$cut->id]);
        $this->info("Test 1 (0 reservations, book 1 Cut): " . ($avail ? 'PASS' : 'FAIL'));

        // Book it
        $r1 = \App\Models\Reservation::create([
            'user_id' => $user->id,
            'store_id' => $store->id,
            'start_time' => $start,
            'end_time' => $end,
            'status' => 'confirmed'
        ]);
        $r1->menus()->attach($cut->id, ['price' => 5000, 'duration' => 60]);

        // TEST 2: Book 2nd Cut (Expect True, 1/2 seats used)
        $avail = $service->isSlotAvailable($store->id, $start, $end, [$cut->id]);
        $this->info("Test 2 (1 reservation, book 2nd Cut): " . ($avail ? 'PASS' : 'FAIL'));

        // Book it
        $r2 = \App\Models\Reservation::create([
            'user_id' => $user->id,
            'store_id' => $store->id,
            'start_time' => $start,
            'end_time' => $end,
            'status' => 'confirmed'
        ]);
        $r2->menus()->attach($cut->id, ['price' => 5000, 'duration' => 60]);

        // TEST 3: Book 3rd Cut (Expect False, 2/2 seats used)
        $avail = $service->isSlotAvailable($store->id, $start, $end, [$cut->id]);
        $this->info("Test 3 (2 reservations, book 3rd Cut): " . (!$avail ? 'PASS' : 'FAIL (Available when should be full)'));

        // TEST 4: Book Spa (Expect True, requires shampoo, seats full but shampoo empty)
        $avail = $service->isSlotAvailable($store->id, $start, $end, [$spa->id]);
        $this->info("Test 4 (2 Cut reservations, book Spa): " . ($avail ? 'PASS' : 'FAIL'));

        // Clean up
        // $r1->delete(); $r2->delete();
    }
}
