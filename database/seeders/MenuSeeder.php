<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\Store;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stores = Store::all();
        
        if ($stores->isEmpty()) {
            return;
        }

        $menuItems = [
            // CUT
            [
                'name' => 'カット',
                'description' => '感性豊かな若手スタイリストが中心流行のスタイルを提供します',
                'price' => 5000,
                'duration' => 60,
            ],
            [
                'name' => '小学生カット',
                'description' => 'シャンプー付き、女性希望や男性希望は＋550円※土日祝日料金 +¥550',
                'price' => 2200,
                'duration' => 60,
            ],
            [
                'name' => '中学生カット',
                'description' => 'シャンプー付き、女性希望や男性希望は＋550円※土日祝日＋¥550',
                'price' => 3850,
                'duration' => 60,
            ],
            [
                'name' => '高校生カット',
                'description' => 'シャンプー付き、女性希望や男性希望は＋550円※土日祝日＋¥550',
                'price' => 3850,
                'duration' => 60,
            ],
            [
                'name' => '大学、専門学生カット',
                'description' => '大学、専門学生カット※土日祝日＋¥550',
                'price' => 4400,
                'duration' => 60,
            ],
            [
                'name' => 'メンズカット',
                'description' => '一般の男性カットです学生はそれぞれ女性学生カット料金から500円OFFです',
                'price' => 4000,
                'duration' => 60,
            ],
            [
                'name' => '眉カット',
                'description' => '眉の手入れもお任せください',
                'price' => 1000,
                'duration' => 15,
            ],
            [
                'name' => 'ポイントカット・毛量調整',
                'description' => '部分的なカット、刈り上げ部分のみなど手軽にご利用できます',
                'price' => 1000,
                'duration' => 15,
            ],
            [
                'name' => 'デザイナーカット',
                'description' => '経験豊かな中堅スタイリスト確かな技術でお客さまのイメージを具現化します',
                'price' => 5500,
                'duration' => 60,
            ],
            [
                'name' => 'トップデザイナーカット',
                'description' => '海外研修の経験を積みグローバルな知識と技術力を持つベテランのスタイリスト',
                'price' => 6000,
                'duration' => 60,
            ],
            [
                'name' => 'ディレクターカット',
                'description' => '講習・撮影など多方面からの依頼も多く美容業界でも人気のスタイリストです',
                'price' => 6500,
                'duration' => 60,
            ],
            [
                'name' => 'ヘッドスパ：ヘアーグローコース',
                'description' => '美しい頭皮から美しい髪へと導くヘッドスパです',
                'price' => 3500,
                'duration' => 30,
            ],
            [
                'name' => 'ヘッドスパ：発毛コース',
                'description' => '頭皮ケアを組み合わせたコースです',
                'price' => 4000,
                'duration' => 30,
            ],
            [
                'name' => 'ヘッドスパ：フューチャーサブライム',
                'description' => '本格的なヘアケアと頭皮ケアを組み合わせたコースです',
                'price' => 4500,
                'duration' => 30,
            ],
            [
                'name' => 'ヘッドスパ：オージュアエイジングスパ',
                'description' => 'ストレスフリーで健康的な頭皮に導きます',
                'price' => 4500,
                'duration' => 30,
            ],
            [
                'name' => 'シェルパトリートメント',
                'description' => '短時間で髪にまとまりを与えダメージを補修します',
                'price' => 600,
                'duration' => 15,
            ],
            [
                'name' => 'オージュアトリートメント',
                'description' => '髪のダメージ&トラブル別に細かく対応するカスタマイズトリートメントです',
                'price' => 2800,
                'duration' => 30,
            ],
            [
                'name' => 'プレミアム・オージュア＋(プラス)',
                'description' => '髪のダメージ&トラブル別に細かく対応するカスタマイズトリートメント',
                'price' => 6000,
                'duration' => 30,
            ],
            [
                'name' => 'ヘッドスパ ：W炭酸',
                'description' => '炭酸の効果で頭皮を洗浄&血行を良くします',
                'price' => 1500,
                'duration' => 15,
            ],
            [
                'name' => 'ヘッドスパ ：デトックスコース',
                'description' => '本格的なヘアケアと頭皮ケアを組み合わせたコースです',
                'price' => 2500,
                'duration' => 30,
            ],
            
            // COLOR
            [
                'name' => 'ブリーチ',
                'description' => 'ブリーチ1プロセスS 3700円 M5600円 L6600円',
                'price' => 3700,
                'duration' => 90,
            ],
             [
                'name' => 'メンズカラー',
                'description' => 'ベリーショート 2000円 ミディアムショート 2500円など',
                'price' => 2000,
                'duration' => 45,
            ],
            [
                'name' => '眉カラー',
                'description' => '眉カラーのみは1000円 ヘアカラーと同時施術で500円です',
                'price' => 500,
                'duration' => 45,
            ],
            [
                'name' => 'メンテナンスカラー',
                'description' => 'Tゾーン(フェイスライン＆分け目)のみのカラーです',
                'price' => 1500,
                'duration' => 30,
            ],
            [
                'name' => 'リタッチカラー',
                'description' => '伸びた根本のみのカラーです',
                'price' => 3000,
                'duration' => 60,
            ],
            [
                'name' => 'デザインカラー',
                'description' => 'S 5000円 M6000円 L 7000円',
                'price' => 5000,
                'duration' => 90,
            ],
            [
                'name' => 'オーガニックカラー(全体染め)',
                'description' => 'S 6000円 M 7000円 L 8000円',
                'price' => 6000,
                'duration' => 90,
            ],

            // PERMANENT
            [
                'name' => 'シスキュアストレート',
                'description' => 'トリートメント効果の高いストレート',
                'price' => 4800,
                'duration' => 120,
            ],
            [
                'name' => '縮毛矯正バイオ',
                'description' => '縮毛矯正ストレートパーマです',
                'price' => 8000,
                'duration' => 150,
            ],
            [
                'name' => 'デジタルパーマ',
                'description' => '形状記憶パーマです',
                'price' => 10000,
                'duration' => 120,
            ],
             [
                'name' => '前髪パーマ',
                'description' => '前髪のみのパーマです',
                'price' => 1800,
                'duration' => 30,
            ],
            [
                'name' => 'ポイントパーマ',
                'description' => '部分的なパーマです',
                'price' => 1800,
                'duration' => 45,
            ],
            [
                'name' => 'ナチュラルパーマ',
                'description' => '全体的なパーマです',
                'price' => 4800,
                'duration' => 60,
            ],
            [
                'name' => 'ピンパーマ',
                'description' => '全体的なパーマです',
                'price' => 4800,
                'duration' => 90,
            ],
            [
                'name' => 'シルクカール',
                'description' => 'トリートメント効果の高いパーマです',
                'price' => 6400,
                'duration' => 90,
            ],
            [
                'name' => 'リッジカール',
                'description' => 'TESTオリジナル形状記憶パーマです',
                'price' => 6000,
                'duration' => 75,
            ],
            [
                'name' => 'ナチュラルストレートパーマ',
                'description' => '自然なストレートパーマです',
                'price' => 5000,
                'duration' => 120,
            ],

            // OTHER / EXTENSION / SET
            [
                'name' => 'まつ毛エクステンション',
                'description' => '初回 4980円',
                'price' => 2980,
                'duration' => 60,
            ],
            [
                'name' => 'まつエクOFF',
                'description' => 'TESTで付けたマツエクは無料です',
                'price' => 1000,
                'duration' => 15,
            ],
            [
                'name' => 'プチメイク',
                'description' => '部分的なメイクです',
                'price' => 1000,
                'duration' => 15,
            ],
            [
                'name' => 'ポイントメイク',
                'description' => 'ファンデーション以外のメイクです',
                'price' => 3000,
                'duration' => 15,
            ],
            [
                'name' => 'フルメイク',
                'description' => 'ファンデーションも含めたフルメイクです',
                'price' => 5000,
                'duration' => 30,
            ],
            [
                'name' => 'ネイル：キューティクルケア',
                'description' => '指先も綺麗に',
                'price' => 1000,
                'duration' => 15,
            ],
             [
                'name' => 'ネイル：アート',
                'description' => 'アート1本の料金です',
                'price' => 100,
                'duration' => 15,
            ],
            [
                'name' => 'エクステ(ルーピング)',
                'description' => 'エクステ1本の料金です',
                'price' => 400,
                'duration' => 60,
            ],
             [
                'name' => 'シールエクステ',
                'description' => 'シールで付けるエクステ1束の料金です',
                'price' => 500,
                'duration' => 60,
            ],
            [
                'name' => 'セットアップ',
                'description' => '指名料は別途です',
                'price' => 5000,
                'duration' => 60,
            ],
             [
                'name' => '浴衣アレンジ',
                'description' => '浴衣用のアレンジスタイルです',
                'price' => 3000,
                'duration' => 30,
            ],
            
            // DRESS
             [
                'name' => '七五三着付け&セット',
                'description' => '時間外予約(早朝料金)は別途頂きます',
                'price' => 20000,
                'duration' => 120,
            ],
            [
                'name' => '成人式ポイントメイク',
                'description' => 'ファンデーションを塗ってご来店ください',
                'price' => 3800,
                'duration' => 15,
            ],
            [
                'name' => '成人式フルメイク',
                'description' => '成人式用フルメイクです',
                'price' => 6000,
                'duration' => 30,
            ],
            [
                'name' => '浴衣着付け',
                'description' => '好評！浴衣ヘアアレンジは3000円です',
                'price' => 3400,
                'duration' => 30,
            ],
            [
                'name' => '着物着付け',
                'description' => '訪問着・留袖8600円振袖12400円',
                'price' => 8600,
                'duration' => 60,
            ],
             [
                'name' => '成人式着付け&セット',
                'description' => '早朝料金込みの当日料金です',
                'price' => 25000,
                'duration' => 120,
            ],
        ];

        foreach ($stores as $store) {
            foreach ($menuItems as $item) {
                Menu::create(array_merge($item, ['store_id' => $store->id]));
            }
        }
    }
}
