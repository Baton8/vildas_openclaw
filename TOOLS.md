# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Preferred tools and configurations
- Environment-specific settings
- Device nicknames
- Anything environment-specific

## Environment

- **OS:** macOS
- **Platform:** Slack (via OpenClaw connector)

---

## Gemini Google Search Grounding

`GOOGLE_API_KEY` が `.env` に設定済み。深掘り調査が必要な時に使う。

```bash
python3 /workspace/tools/gemini_search.py "クエリ"
```

または Python コードから `from gemini_search import gemini_search` で直接呼び出し可。

- モデル: `gemini-3.1-pro-preview`（デフォルト）
- grounding: `googleSearch` を有効化
- ストリーミング不使用（`generateContent`）

---

Add whatever helps you do your job. This is your cheat sheet.
