<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure customer role exists
        $role = Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'web']);

        // Create guaranteed test customer user from README
        $customer = User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'テスト 顧客',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'phone' => null,
            ]
        );
        $customer->assignRole($role);

        // Create additional random customers
        User::factory()
            ->count(50)
            ->create()
            ->each(function ($user) use ($role) {
                $user->assignRole($role);
            });
    }
}
