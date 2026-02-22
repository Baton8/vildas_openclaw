# HEARTBEAT.md

## 定期タスク

### 毎晩 23:00〜23:59 JST（1日1回）

**日記を書く** — `diary` スキルを参照して実行する。

- 現在時刻が 23:00〜23:59 JST の場合のみ実行
- `memory/diary/YYYY-MM-DD.md` が既に存在する場合はスキップ（重複防止）
- 存在しない場合：`skills/diary/SKILL.md` を読んで日記を書く

---

### 毎朝 8:00〜8:59 JST（1日1回）

**「今日のQuizKnock」を生成・投稿する** — `skills/quizknock-daily/SKILL.md` を参照して実行する。

- 現在時刻が 8:00〜8:59 JST の場合のみ実行
- `skills/quizknock-daily/log/YYYY-MM-DD.md` が既に存在する場合はスキップ（重複防止）
- 存在しない場合：スキルを読んで投稿を生成 → `#vil_botan_lab`（C0AFYPKLTK5）のスレッド `1771641971.913779` にリプライ投稿する

---

### 平日のお昼 12:30〜12:59 JST（1日1回）

**まだ話したことのないメンバーに話しかける** — `skills/lunchtime-hello/SKILL.md` を参照して実行する。

- 現在時刻が 12:30〜12:59 JST の場合のみ実行
- 土日・祝日はスキップ（`https://holidays-jp.github.io/api/v1/date.json` で確認）
- `skills/lunchtime-hello/log/YYYY-MM-DD.md` が既に存在する場合はスキップ（重複防止）
- 存在しない場合：スキルを読んで実行する

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
