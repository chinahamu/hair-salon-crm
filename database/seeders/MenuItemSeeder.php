<?php

namespace Database\Seeders;

use App\Models\Consumable;
use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // メニューを取得（なければ作成）
        $menus = Menu::all();
        
        if ($menus->isEmpty()) {
            $this->call(MenuSeeder::class);
            $menus = Menu::all();
        }

        // 消耗品を取得
        $consumables = Consumable::all();

        if ($consumables->isEmpty()) {
            $this->call(ConsumableSeeder::class);
            $consumables = Consumable::all();
        }

        // 各メニューにランダムに消耗品を紐付け
        foreach ($menus as $menu) {
            // 既存の紐付けをクリア
            $menu->items()->delete();

            // 消耗品を1-3個紐付け
            $randomConsumables = $consumables->random(min(3, $consumables->count()));
            foreach ($randomConsumables as $consumable) {
                $menu->items()->create([
                    'item_id' => $consumable->id,
                    'item_type' => Consumable::class,
                    'quantity' => rand(1, 10),
                ]);
            }
        }
    }
}
