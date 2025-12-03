<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DocumentTemplate;

class DocumentTemplateSeeder extends Seeder
{
    public function run()
    {
        $templates = [
            [
                'title' => 'カラー・パーマ施術同意書',
                'type' => 'consent',
                'content' => '<h1>カラー・パーマ施術同意書</h1>
<p>私、<strong>{{ customer_name }}</strong>（以下「甲」という）は、貴店（以下「乙」という）においてカラー・パーマ施術を受けるにあたり、以下の事項について十分な説明を受け、その内容を理解し、同意いたしました。</p>

<h2>1. 施術の内容</h2>
<p>薬剤を使用し、髪の色を変える、または形状を変化させる施術です。</p>

<h2>2. リスク・注意事項</h2>
<ul>
    <li>頭皮に刺激を感じる場合があります。</li>
    <li>髪のダメージが進行する可能性があります。</li>
    <li>アレルギー反応が出る可能性があります（過去にかぶれたことがある場合は必ずお申し出ください）。</li>
</ul>

<h2>3. 施術後の注意点</h2>
<ul>
    <li>当日のシャンプーは控えていただくと色が定着しやすくなります。</li>
    <li>衣服への色移りにご注意ください。</li>
</ul>

<p>以上の説明を受け、施術を受けることに同意します。</p>

<p>日付: {{ current_date }}</p>
<p>署名者: {{ customer_name }}</p>',
                'is_active' => true,
            ],
            [
                'title' => 'サービス契約書',
                'type' => 'contract',
                'content' => '<h1>サービス契約書</h1>
<p>本契約書は、<strong>{{ clinic_name }}</strong>（以下「甲」）と<strong>{{ customer_name }}</strong>（以下「乙」）との間で締結されるサービスに関する契約である。</p>

<h2>第1条（目的）</h2>
<p>甲は乙に対し、所定の美容サービスを提供し、乙はこれに対し対価を支払う。</p>

<h2>第2条（契約期間）</h2>
<p>本契約の有効期間は、契約締結日より1年間とする。</p>

<p>日付: {{ current_date }}</p>
<p>甲: {{ clinic_name }} 代表者</p>
<p>乙: {{ customer_name }}</p>',
                'is_active' => true,
            ],
        ];

        foreach ($templates as $template) {
            DocumentTemplate::create($template);
        }
    }
}
