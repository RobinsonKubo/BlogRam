<h1>制作方針・技術スタック</h1>

<p>プロジェクトはGitHubで管理</p>
<ol>
    <li>フロント、UI部分：HTML/CSS/JavaScript</li>
        <p>セキュリティ対策も万全に</p>
        <p>コメント機能の装飾</p>
    <li>APIサーバー：PHP・Laravel　※Doker上で構築</li>
        <p>コメント保存APIを作成</p>
    <li>データベース：MySQL　※Laravelとの接続</li>
    <li>ログイン認証：Firebase Authentication ※Google認証のみ</li>
    <li>Dockerの構成：PHP/Laravel/MySQL/Nginx ※Nginx→Apacheも検討</li>
    <li>API通信：JavaScript fetch() ※認証情報も含めて送信</li>
        <p>コメント投稿/取得</p>
    <li>コメント機能：Laravel API/MySQL ※Firebase認証との連携</li>
</ol>

保守・改善：スパム対策

Googleログイン認証機能
コメント機能 Firebase認証連携