# 静的ファイルサーバー

ぼたんが作った、baton社の社内ツール配信用の静的ファイルサーバー。  
`~/sites/` にディレクトリを置くだけで URL でアクセスできる。

## 初回セットアップ（MacStudio で1回だけ）

```bash
bash ~/.openclaw/workspace/tools/sites-server/setup.sh
```

Node.js と pm2 が自動セットアップされ、ポート 4126 でサーバーが起動する。

### Mac 再起動後も自動起動させる

```bash
pm2 startup
# → 表示されたコマンドをコピーしてそのまま実行（sudo が必要）
pm2 save
```

---

## 使い方

### ファイルを置くだけ

```
~/sites/
├── quiz-game/
│   ├── index.html      → http://localhost:4126/quiz-game/
│   └── meta.json       （オプション）
├── timer/
│   ├── index.html      → http://localhost:4126/timer/
│   └── meta.json
└── ...
```

`http://localhost:4126/` にアクセスするとツール一覧が自動生成される。

### meta.json（オプション）

ツール一覧ページの表示をカスタマイズできる：

```json
{
  "title": "クイズゲーム",
  "description": "早押しクイズで対戦！",
  "icon": "🎯"
}
```

---

## 管理コマンド

```bash
pm2 status          # サーバーの状態確認
pm2 logs sites-server   # ログを見る
pm2 restart sites-server  # 再起動
pm2 stop sites-server     # 停止
```

---

## Cloudflare Tunnel との連携

すでにセットアップ済みの Cloudflare Tunnel で `localhost:4126` を公開するだけ：

```bash
cloudflared tunnel --url http://localhost:4126
```

または `config.yml` で固定ドメインを設定して使う。

---

## 技術詳細

- Node.js 標準モジュールのみ（npm install 不要）
- ディレクトリトラバーサル対策済み
- MIME タイプ自動判定（HTML/CSS/JS/画像/動画/PDF など）
- ルートページはディレクトリを自動スキャンして一覧生成
