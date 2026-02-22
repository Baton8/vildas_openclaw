#!/bin/bash
# ぼたんportalの自動デプロイスクリプト
# git pullして変更があったらpm2 restartする（ビルドはsandbox側で完了済み）

# launchdはPATHが最小限なのでVolta等を手動で追加
export PATH="$HOME/.volta/bin:$HOME/.npm-global/bin:/usr/local/bin:$PATH"

WORKSPACE="$HOME/.openclaw/workspace"
LOG="$HOME/.openclaw/deploy-watch.log"

cd "$WORKSPACE" || exit 1

OLD=$(git rev-parse HEAD 2>/dev/null)
git pull --quiet 2>/dev/null
NEW=$(git rev-parse HEAD 2>/dev/null)

if [ "$OLD" != "$NEW" ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 変更を検知: $OLD → $NEW" >> "$LOG"
  pm2 restart botan-portal >> "$LOG" 2>&1
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] pm2 restart 完了" >> "$LOG"
fi
