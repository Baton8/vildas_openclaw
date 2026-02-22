# ぼたん portal

Next.js 製のぼたんポータルサイト。

## 機能

- **静的ファイル配信** — `public/` に置くだけでファイルベースルーティング
- **日記ブログ** — `memory/diary/YYYY-MM-DD.md` を自動でブログ表示
- **ツール拡張** — `app/` に新しいページを追加するだけ

## セットアップ

```bash
cd sites/portal
npm install
npm run dev   # http://localhost:3001
```

## 本番起動

```bash
npm run build
npm run start  # ポート3001で起動
```

Cloudflare Tunnel で `localhost:3001` を外部公開する。

## 環境変数（.env.local）

```
WORKSPACE_PATH=/Users/c3dev/.openclaw/workspace
```

日記ファイルの場所を指定。

## ディレクトリ構成

```
sites/portal/
├── app/
│   ├── diary/
│   │   ├── page.tsx          # 日記一覧
│   │   └── [date]/page.tsx   # 個別日記
│   ├── layout.tsx
│   └── page.tsx              # ホーム
├── lib/
│   └── diary.ts              # ファイル読み込みユーティリティ
└── public/                   # 静的ファイル置き場
```
