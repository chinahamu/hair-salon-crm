<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test Customer',
            'email' => 'customer@example.com',
            'password' => bcrypt('password'),
        ]);

        \App\Models\Staff::create([
            'name' => 'Test Staff',
            'email' => 'staff@example.com',
            'password' => bcrypt('password'),
        ]);

        $this->call([
            OrganizationSeeder::class,
            // MenuSeeder::class, // Assuming this exists or will be added
            FacilitySeeder::class,
        ]);
    }
}
