<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\Reservation;
use App\Models\Shift;
use App\Models\Staff;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ReservationTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_create_shift()
    {
        $organization = Organization::create(['name' => 'Org 1']);
        $store = Store::create(['organization_id' => $organization->id, 'name' => 'Store 1', 'address' => 'Addr', 'phone' => '123']);
        $staff = Staff::create([
            'organization_id' => $organization->id,
            'name' => 'Staff 1',
            'email' => 'staff1@example.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->actingAs($staff, 'staff')->post(route('staff.shifts.store'), [
            'store_id' => $store->id,
            'staff_id' => $staff->id,
            'start_time' => now()->addHour()->toDateTimeString(),
            'end_time' => now()->addHours(5)->toDateTimeString(),
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('shifts', [
            'staff_id' => $staff->id,
            'store_id' => $store->id,
        ]);
    }

    public function test_customer_can_reserve_with_nomination()
    {
        $organization = Organization::create(['name' => 'Org 1']);
        $store = Store::create(['organization_id' => $organization->id, 'name' => 'Store 1', 'address' => 'Addr', 'phone' => '123']);
        $staff = Staff::create([
            'organization_id' => $organization->id,
            'name' => 'Staff 1',
            'email' => 'staff1@example.com',
            'password' => bcrypt('password'),
        ]);
        $user = User::factory()->create();

        // Create Shift
        Shift::create([
            'staff_id' => $staff->id,
            'store_id' => $store->id,
            'start_time' => now()->addHours(2),
            'end_time' => now()->addHours(6),
        ]);

        $response = $this->actingAs($user)->post(route('reservations.store'), [
            'store_id' => $store->id,
            'staff_id' => $staff->id,
            'start_time' => now()->addHours(3)->toDateTimeString(),
            'end_time' => now()->addHours(4)->toDateTimeString(),
            'is_nominated' => true,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('reservations', [
            'staff_id' => $staff->id,
            'user_id' => $user->id,
            'is_nominated' => true,
        ]);
    }

    public function test_customer_cannot_reserve_unavailable_staff()
    {
        $organization = Organization::create(['name' => 'Org 1']);
        $store = Store::create(['organization_id' => $organization->id, 'name' => 'Store 1', 'address' => 'Addr', 'phone' => '123']);
        $staff = Staff::create([
            'organization_id' => $organization->id,
            'name' => 'Staff 1',
            'email' => 'staff1@example.com',
            'password' => bcrypt('password'),
        ]);
        $user = User::factory()->create();

        // No Shift created

        $response = $this->actingAs($user)->post(route('reservations.store'), [
            'store_id' => $store->id,
            'staff_id' => $staff->id,
            'start_time' => now()->addHours(3)->toDateTimeString(),
            'end_time' => now()->addHours(4)->toDateTimeString(),
            'is_nominated' => true,
        ]);

        $response->assertSessionHasErrors(['staff_id']);
    }

    public function test_customer_can_reserve_without_nomination()
    {
        $organization = Organization::create(['name' => 'Org 1']);
        $store = Store::create(['organization_id' => $organization->id, 'name' => 'Store 1', 'address' => 'Addr', 'phone' => '123']);
        $staff = Staff::create([
            'organization_id' => $organization->id,
            'name' => 'Staff 1',
            'email' => 'staff1@example.com',
            'password' => bcrypt('password'),
        ]);
        $user = User::factory()->create();

        // Create Shift
        Shift::create([
            'staff_id' => $staff->id,
            'store_id' => $store->id,
            'start_time' => now()->addHours(2),
            'end_time' => now()->addHours(6),
        ]);

        $response = $this->actingAs($user)->post(route('reservations.store'), [
            'store_id' => $store->id,
            'start_time' => now()->addHours(3)->toDateTimeString(),
            'end_time' => now()->addHours(4)->toDateTimeString(),
            'is_nominated' => false,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('reservations', [
            'user_id' => $user->id,
            'staff_id' => $staff->id, // Should auto-assign
            'is_nominated' => false,
        ]);
    }
}
