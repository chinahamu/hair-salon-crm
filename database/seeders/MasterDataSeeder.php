<?php

namespace Database\Seeders;

use App\Models\Clinic;

use App\Models\Menu;
use App\Models\Product;
use App\Models\Room;
use Illuminate\Database\Seeder;

class MasterDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clinic = Clinic::first();
        if (!$clinic) {
            $clinic = Clinic::factory()->create();
        }

        // Create Menus
        // Menu::factory()->count(10)->create();

        // Create Products
        Product::factory()->count(20)->create();
    }
}
