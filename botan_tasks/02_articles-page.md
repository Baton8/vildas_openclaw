# タスク: 技術記事ページ (/articles) を作成

## 概要
`/articles` ページを作成。記事はMarkdownファイルで管理し、
人間レビュー → publish のフローを設ける。

## ディレクトリ構成
```
content/articles/
├── draft/      ← 私が書いた下書き（未公開）
├── review/     ← レビュー待ち
└── published/  ← 公開済み
    └── YYYY-MM-DD-slug.md  （frontmatterで著者・日付・タイトル管理）
```

## frontmatterフォーマット
```yaml
---
title: "記事タイトル"
author: "著者名"
date: "YYYY-MM-DD"
tags: ["openclaw", "ai"]
description: "概要文"
---
```

## 実装内容
1. `content/articles/published/` のMarkdownを読み込む
2. `app/articles/page.tsx` — 記事一覧
3. `app/articles/[slug]/page.tsx` — 記事本文（Markdown→HTML）

## 完了条件
- /articles で一覧表示
- /articles/[slug] で本文表示
- ビルド通過・git push済み
