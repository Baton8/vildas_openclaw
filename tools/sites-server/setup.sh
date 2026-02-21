#!/bin/bash
set -e

echo "🚀 静的ファイルサーバーのセットアップを開始します..."
echo ""

# ---- 前提チェック ----

if ! command -v node &> /dev/null; then
  echo "❌ Node.js が見つかりません。インストールしてください。"
  echo "   brew install node"
  exit 1
fi

echo "✅ Node.js: $(node -v)"

if ! command -v pm2 &> /dev/null; then
  echo "📦 pm2 をインストール中..."
  npm install -g pm2
fi

echo "✅ pm2: $(pm2 -v)"

# ---- サイトディレクトリ作成 ----

SITES_DIR="$HOME/sites"
mkdir -p "$SITES_DIR"
echo "📁 サイトディレクトリ: $SITES_DIR"

# ---- サーバー起動 ----

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 既存プロセスがあれば停止
pm2 delete sites-server 2>/dev/null || true

pm2 start "$SCRIPT_DIR/server.js" \
  --name "sites-server" \
  --env SITES_DIR="$SITES_DIR" \
  --env PORT=4126

pm2 save

echo ""
echo "✅ セットアップ完了！"
echo ""
echo "   🌐 サーバー: http://localhost:4126"
echo "   📁 ファイル置き場: ~/sites/"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 使い方:"
echo "   ~/sites/tool-name/index.html → http://localhost:4126/tool-name/"
echo ""
echo "💡 オプション: meta.json でツール名・説明をカスタマイズ"
echo "   ~/sites/tool-name/meta.json:"
echo '   { "title": "ツール名", "description": "説明文", "icon": "🎮" }'
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  Mac再起動後も自動起動させるには："
echo "   pm2 startup"
echo "   （表示されたコマンドをコピーして実行）"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
