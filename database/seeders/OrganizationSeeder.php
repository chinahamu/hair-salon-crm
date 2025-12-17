<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Organization;
use App\Models\Staff;
use Illuminate\Support\Facades\Hash;

class OrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Organization A
        $orgA = Organization::firstOrCreate(['name' => 'Organization A']);

        // Create Staff for Org A
        Staff::firstOrCreate(
            ['email' => 'staff-a@example.com'],
            [
                'name' => 'Staff A',
                'password' => Hash::make('password'),
                'organization_id' => $orgA->id,
            ]
        );

        // Create Stores for Org A (Check if exists first to avoid duplicates on re-run if name is unique, or just create if allowed)
        // For simplicity, we'll check by email or phone which should be unique usually.
        if (!$orgA->stores()->where('email', 'store-a1@example.com')->exists()) {
            $orgA->stores()->create([
                'name' => 'Store A1',
                'address' => 'Tokyo, Shibuya',
                'phone' => '03-1234-5678',
                'email' => 'store-a1@example.com',
                'description' => 'Main store for Org A',
            ]);
        }
        if (!$orgA->stores()->where('email', 'store-a2@example.com')->exists()) {
            $orgA->stores()->create([
                'name' => 'Store A2',
                'address' => 'Tokyo, Shinjuku',
                'phone' => '03-8765-4321',
                'email' => 'store-a2@example.com',
                'description' => 'Second store for Org A',
            ]);
        }

        // Create Organization B
        $orgB = Organization::firstOrCreate(['name' => 'Organization B']);

         // Create Staff for Org B
         Staff::firstOrCreate(
            ['email' => 'staff-b@example.com'],
            [
                'name' => 'Staff B',
                'password' => Hash::make('password'),
                'organization_id' => $orgB->id,
            ]
        );

        // Create Stores for Org B
        if (!$orgB->stores()->where('email', 'store-b1@example.com')->exists()) {
            $orgB->stores()->create([
                'name' => 'Store B1',
                'address' => 'Osaka, Umeda',
                'phone' => '06-1234-5678',
                'email' => 'store-b1@example.com',
                'description' => 'Main store for Org B',
            ]);
        }
    }
}
