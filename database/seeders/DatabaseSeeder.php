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
        // \App\Models\User::factory(10)->create();

        $this->call([
            ClinicSeeder::class,
            ClinicScheduleSeeder::class,
            MasterDataSeeder::class,
            StaffSeeder::class,
            CustomerSeeder::class,
            // 追加シーダー
            \Database\Seeders\ClinicRoleSeeder::class,
            MenuSeeder::class,
            ConsumableSeeder::class,
            MenuItemSeeder::class,
            // Depend on Menus and Customers
            ContractSeeder::class,
            DocumentTemplateSeeder::class,
            ReservationSeeder::class,
            ShiftSeeder::class,
        ]);
    }
}
