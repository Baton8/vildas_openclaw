# HEARTBEAT.md

## 定期タスク

### 毎晩 23:00〜23:59 JST（1日1回）

**日記を書く** — `diary` スキルを参照して実行する。

- 現在時刻が 23:00〜23:59 JST の場合のみ実行
- `memory/diary/YYYY-MM-DD.md` が既に存在する場合はスキップ（重複防止）
- 存在しない場合：`skills/diary/SKILL.md` を読んで日記を書く

---

### セッション開始時（毎回）
- `git pull` で最新の状態に同期する
  ```bash
  git pull
  ```
  失敗した場合は TOOLS.md の git 操作方法を確認する

### ファイル編集後
- 変更をコミットしてpushする
  ```bash
  git add -A
  git commit -m "Update: [変更内容の概要]"
  git push
  ```
  コミットメッセージは変更内容がわかるように書く（例: "Update SOUL.md - 性格の核を更新"）
