<?php

namespace Database\Seeders;

use App\Models\Consumable;
use App\Models\Stock;
use Illuminate\Database\Seeder;

class ConsumableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 消耗品のダミーデータ (美容室向け)
        $consumables = [
            [
                'name' => 'カラー用手袋 M',
                'description' => 'ラテックスフリー',
                'category' => '衛生用品',
                'unit' => '箱',
                'stock' => 50,
                'alert_threshold' => 10,
            ],
            [
                'name' => 'イヤーキャップ',
                'description' => '使い捨てイヤーキャップ',
                'category' => '衛生用品',
                'unit' => '袋',
                'stock' => 100,
                'alert_threshold' => 20,
            ],
            [
                'name' => 'フェイスガーゼ',
                'description' => 'シャンプー用',
                'category' => '衛生用品',
                'unit' => '箱',
                'stock' => 30,
                'alert_threshold' => 5,
            ],
            [
                'name' => 'アルミホイル',
                'description' => 'ハイライト用',
                'category' => '施術用品',
                'unit' => '本',
                'stock' => 20,
                'alert_threshold' => 5,
            ],
            [
                'name' => 'ネックペーパー',
                'description' => 'カット用',
                'category' => '衛生用品',
                'unit' => '本',
                'stock' => 50,
                'alert_threshold' => 10,
            ],
        ];

        foreach ($consumables as $data) {
            $consumable = Consumable::create([
                'name' => $data['name'],
                'description' => $data['description'],
                'category' => $data['category'],
                'unit' => $data['unit'],
                'alert_threshold' => $data['alert_threshold'],
            ]);

            // 在庫登録
            $consumable->stock()->create([
                'quantity' => $data['stock'],
            ]);
        }
    }
}
