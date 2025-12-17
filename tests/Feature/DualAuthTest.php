<?php

namespace Tests\Feature;

use App\Models\Staff;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DualAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_view_login_page()
    {
        $response = $this->get('/customer/login');
        $response->assertStatus(200);
    }

    public function test_staff_can_view_login_page()
    {
        $response = $this->get('/staff/login');
        $response->assertStatus(200);
    }

    public function test_customer_can_login()
    {
        $user = User::factory()->create();

        $response = $this->post('/customer/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect('/'); // Default redirect for Fortify/Inertia
    }

    public function test_staff_can_login()
    {
        $staff = Staff::create([
            'name' => 'Admin Staff',
            'email' => 'admin@staff.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->post('/staff/login', [
            'email' => 'admin@staff.com',
            'password' => 'password',
        ]);

        $this->assertAuthenticated('staff');
        $this->assertAuthenticatedAs($staff, 'staff');
        $response->assertRedirect(route('staff.dashboard'));
    }

    public function test_guest_cannot_access_staff_dashboard()
    {
        $response = $this->get(route('staff.dashboard'));
        $response->assertRedirect(route('staff.login'));
    }

    public function test_staff_can_access_dashboard()
    {
        $staff = Staff::create([
            'name' => 'Admin Staff',
            'email' => 'admin@staff.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->actingAs($staff, 'staff')->get(route('staff.dashboard'));
        $response->assertStatus(200);
    }
}
