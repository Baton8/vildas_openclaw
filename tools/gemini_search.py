#!/usr/bin/env python3
"""
Gemini Google Search Grounding ツール
使い方: python3 tools/gemini_search.py "調べたいクエリ"
"""

import sys
import json
import re
import urllib.request

def load_api_key():
    try:
        with open("/workspace/.env") as f:
            env_text = f.read()
        m = re.search(r'GOOGLE_API_KEY=(.+)', env_text)
        if m:
            return m.group(1).strip()
    except FileNotFoundError:
        pass
    import os
    key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if key:
        return key
    raise RuntimeError("GOOGLE_API_KEY が見つかりません")


def gemini_search(query: str, model: str = "gemini-3.1-pro-preview") -> dict:
    """
    Gemini の googleSearch grounding を使って検索し、結果を返す。
    戻り値: {"text": str, "sources": [{"title": str, "url": str}]}
    """
    key = load_api_key()
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": query}]
            }
        ],
        "generationConfig": {
            "temperature": 0.5,
            "thinkingConfig": {
                "thinkingLevel": "MEDIUM"
            }
        },
        "tools": [
            {"googleSearch": {}}
        ]
    }

    body = json.dumps(payload).encode()
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            "Content-Type": "application/json",
            "x-goog-api-key": key
        }
    )

    with urllib.request.urlopen(req, timeout=60) as r:
        data = json.loads(r.read())

    # テキストを抽出
    text = ""
    for candidate in data.get("candidates", []):
        for part in candidate.get("content", {}).get("parts", []):
            if "text" in part:
                text += part["text"]

    # grounding メタデータからソースを抽出
    sources = []
    for candidate in data.get("candidates", []):
        grounding = candidate.get("groundingMetadata", {})
        for chunk in grounding.get("groundingChunks", []):
            web = chunk.get("web", {})
            if web.get("uri"):
                sources.append({
                    "title": web.get("title", ""),
                    "url": web["uri"]
                })

    return {"text": text, "sources": sources}


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 gemini_search.py <query>", file=sys.stderr)
        sys.exit(1)

    query = " ".join(sys.argv[1:])
    result = gemini_search(query)

    print("=== 回答 ===")
    print(result["text"])
    if result["sources"]:
        print("\n=== ソース ===")
        for s in result["sources"]:
            print(f"- {s['title']}: {s['url']}")


if __name__ == "__main__":
    main()
