<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body>
    <h2>お問い合わせを受け付けました</h2>
    <p>以下の内容でお問い合わせがありました。</p>

    <hr>

    <p><strong>お名前:</strong> {{ $data['name'] }}</p>
    <p><strong>メールアドレス:</strong> {{ $data['email'] }}</p>
    <p><strong>件名:</strong> {{ $data['subject'] }}</p>
    
    <p><strong>お問い合わせ内容:</strong></p>
    <p>{!! nl2br(e($data['message'])) !!}</p>

    <hr>
</body>
</html>
