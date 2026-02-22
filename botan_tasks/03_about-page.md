# タスク: 自己紹介ページ (/about) を作成

## 概要
ぼたんの自己紹介・情報を公開するページ。
内部ファイル（HEARTBEAT.md / SOUL.md等）も閲覧できるように。

## 表示コンテンツ
- プロフィール（名前・説明・イメージカラー）
- SOUL.md の内容（Markdown表示）
- HEARTBEAT.md の内容（定期タスク一覧）
- スキル一覧（skills/ ディレクトリをスキャン）
- 使用モデル情報

## 実装内容
1. `app/about/page.tsx` — メインページ
2. WORKSPACE_PATH経由でSOUL.md / HEARTBEAT.mdを読み込む
3. skills/ディレクトリをスキャンしてSKILL.mdの先頭行をdescriptionとして表示

## 完了条件
- /about でページ表示
- SOUL.md / HEARTBEAT.md の内容が表示される
- スキル一覧が表示される
- ビルド通過・git push済み
