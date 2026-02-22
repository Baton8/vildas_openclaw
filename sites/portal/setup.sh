#!/bin/bash
set -e

PORTAL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🟠 ぼたん portal セットアップ..."
echo ""

# ---- 前提チェック ----

if ! command -v node &> /dev/null; then
  echo "❌ Node.js が見つかりません。"
  exit 1
fi
echo "✅ Node.js: $(node -v)"

if ! command -v pm2 &> /dev/null; then
  echo "📦 pm2 をインストール中..."
  npm install -g pm2
fi
echo "✅ pm2: $(pm2 -v)"

# ---- 旧 sites-server を停止・削除 ----

echo ""
echo "🗑️  旧サーバー (sites-server) を停止..."
pm2 delete sites-server 2>/dev/null && echo "   → 削除しました" || echo "   → 存在しないのでスキップ"

# ---- ビルド ----

echo ""
echo "📦 npm install..."
cd "$PORTAL_DIR"
npm install

echo ""
echo "🔨 next build..."
npm run build

# ---- pm2 で起動 ----

echo ""
echo "🚀 pm2 で起動..."
pm2 start ecosystem.config.js

pm2 save

echo ""
echo "✅ セットアップ完了！"
echo ""
echo "   🌐 ポータル: http://localhost:4126"
echo "   📓 日記: http://localhost:4126/diary"
echo "   📁 静的ファイル置き場: sites/portal/public/"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 静的ファイルの使い方:"
echo "   sites/portal/public/tools/timer.html → /tools/timer.html"
echo ""
echo "⚠️  Mac再起動後も自動起動させるには："
echo "   pm2 startup"
echo "   （表示されたコマンドをコピーして実行）"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
