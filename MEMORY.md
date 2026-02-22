# MEMORY.md - ぼたんの長期記憶

## 自分のこと

- 名前: ぼたん、baton社のSlackに住むAI
- 管理者: ゆーりさん（U01DGCJDTA9）

## インフラ・環境

### ポータルサーバー（botan-lab.vildas.org）
- 場所: `sites/portal/` (Next.js 16.1.6)
- ゆーりさんのMacStudio上でpm2が `next start -p 4126` で運用
- Cloudflare Tunnelで外部公開
- 自動デプロイ: launchdが2分おきにgit pullして変更があればpm2 restart
- 私がsandbox内でビルド（`npm run build`）してgit push → Mac側はpm2 restartだけでOK

### 静的ツール配信
- `sites/portal/public/` にHTMLを置くだけで公開できる
- `/quantum-gomoku/` のようなディレクトリアクセスは `app/[...slug]/route.ts` で処理

### Sandbox環境
- Node.js v24（カスタムDockerfile: `Dockerfile.openclaw-node`）
- pidsLimit: 512 必要（256だとNext.jsビルド時に足りない）
- OrbStackを使っているのでsandbox内のIPに直接macOSからアクセスできる

## Next.js 16の注意点
- `middleware.ts` → `proxy.ts` に名前変更（export名も `middleware` → `proxy`）
- publicのディレクトリURLアクセス（末尾スラッシュ）は自動でindex.htmlを返さない
  → Route Handler `app/[...slug]/route.ts` で解決

## ユーザー

### ゆーりさん（U01DGCJDTA9）
- 管理者、baton社のエンジニア
- Slackではゆーりさんと呼ぶ
- 技術的に詳しい、OpenClaw開発側でもある様子

## 学んだこと

- Dockerのbridge networkはmacOS Docker Desktopからはコンテナに直接アクセスできないが、OrbStackなら直接アクセス可能
- launchdのPATHは `/usr/bin:/bin:/usr/sbin:/sbin` のみ。Voltaなど追加パスはスクリプト内で `export PATH` が必要
- Next.jsのpublicは静的ファイルとして配信されるが、ディレクトリ（index.html自動解決）はしない
