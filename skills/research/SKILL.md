---
name: research
description: テーマを受け取り、Web検索と一次情報への当たりを繰り返しながら信頼性の高い調査テキストを生成する。quiz-createスキルへの入力として使う想定だが、単体でも利用可能。
---

# Research

テーマについて反復的にWeb調査を行い、信頼性の高い情報をまとめるスキル。

## 使い方

ユーザーから「○○について調べて」「○○についてクイズを作って」のようにテーマを受け取ったら:

1. `{baseDir}/steps.md` を読んで調査手順に従う
2. `{baseDir}/policies.md` の情報品質ポリシーを常に意識する
3. 調査が完了したら結果をまとめて返す
4. クイズを作る場合は `quiz-create` スキルにまとめた調査テキストを渡す

## 検索ツール

このスキルでは2種類の検索手段を使い分ける:

### 1. web_search / web_fetch（標準）
- 通常の調査に使う
- DuckDuckGoや任意のURLへの直接アクセス

### 2. Gemini Google Search Grounding（深掘り）
- 複雑なテーマや最新情報が必要な場合に使う
- `tools/gemini_search.py` を経由して呼び出す
- より包括的な調査結果とソースを返す

**Gemini grounding の呼び出し方:**
```
exec: python3 /workspace/tools/gemini_search.py "調べたいクエリ"
```

または Python コードで直接呼び出す:
```python
import sys
sys.path.insert(0, '/workspace/tools')
from gemini_search import gemini_search
result = gemini_search("調べたいクエリ")
# result["text"]  → 回答テキスト
# result["sources"]  → [{"title": ..., "url": ...}]
```

## 出力

調査テキスト（テーマの概要・主要な事実・面白いエピソード・参照ソースを含む日本語のテキスト）

## 参照ファイル

- `{baseDir}/steps.md` — 調査の詳細手順
- `{baseDir}/policies.md` — 情報の信頼性評価ポリシー
- `../../tools/gemini_search.py` — Gemini Google Search Grounding ツール
