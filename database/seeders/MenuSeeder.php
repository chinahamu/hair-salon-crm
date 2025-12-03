<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menus = [
            [
                'name' => 'カット',
                'description' => 'シャンプー・ブロー込',
                'price' => 6600,
                'duration_minutes' => 60,
                'required_role' => 'stylist',
                'required_room_type' => 'seat',
            ],
            [
                'name' => 'カラー',
                'description' => 'フルカラー（シャンプー・ブロー別）',
                'price' => 8800,
                'duration_minutes' => 90,
                'required_role' => 'stylist',
                'required_room_type' => 'seat',
            ],
            [
                'name' => 'パーマ',
                'description' => 'デザインパーマ（カット別）',
                'price' => 11000,
                'duration_minutes' => 120,
                'required_role' => 'stylist',
                'required_room_type' => 'seat',
            ],
            [
                'name' => 'トリートメント',
                'description' => 'システムトリートメント',
                'price' => 4400,
                'duration_minutes' => 30,
                'required_role' => 'assistant',
                'required_room_type' => 'shampoo',
            ],
            [
                'name' => 'ヘッドスパ',
                'description' => 'リラクゼーションヘッドスパ',
                'price' => 6600,
                'duration_minutes' => 45,
                'required_role' => 'assistant',
                'required_room_type' => 'shampoo',
            ],
            [
                'name' => '縮毛矯正',
                'description' => 'ストレートパーマ',
                'price' => 22000,
                'duration_minutes' => 180,
                'required_role' => 'stylist',
                'required_room_type' => 'seat',
            ],
            [
                'name' => 'ヘッドスパ 5回券',
                'description' => 'お得な回数券',
                'price' => 30000,
                'duration_minutes' => 45,
                'required_role' => 'assistant',
                'required_room_type' => 'shampoo',
                'num_tickets' => 5,
                'validity_period_days' => 180,
            ],
        ];

        foreach ($menus as $menuData) {
            Menu::create($menuData);
        }
    }
}
