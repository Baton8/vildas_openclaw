#!/usr/bin/env python3
"""
YouTube動画解析ツール（Gemini API使用）

使い方:
  python3 tools/youtube_analyze.py <YouTube URL> [オプション]

オプション:
  --model MODEL     使用するモデル (デフォルト: gemini-3.1-pro-preview)
  --mode full       フル解析（タイトル・出演者・概要・テロップ全て）
  --mode transcript テロップ書き起こしのみ
  --mode summary    タイトル・出演者・概要のみ
"""

import sys
import json
import re
import urllib.request
import argparse

DEFAULT_MODEL = "gemini-3.1-pro-preview"

PROMPTS = {
    "full": """この動画を詳しく解析して、以下の情報を日本語で出力してください：

1. **動画タイトル**
2. **出演者・登場人物**
3. **内容概要**（3〜5文程度）
4. **テロップ・字幕の書き起こし**（タイムスタンプ付きで全て）
5. **その他の特記事項**（あれば）""",

    "transcript": "この動画のテロップ・字幕・発言内容を全てタイムスタンプ付きで書き起こしてください。日本語で出力してください。",

    "summary": """この動画について、以下の情報を日本語で出力してください：

1. **動画タイトル**
2. **出演者・登場人物**
3. **内容概要**（3〜5文程度）""",
}


def load_api_key():
    """APIキーを.envまたは環境変数から読み込む"""
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
    raise RuntimeError("GOOGLE_API_KEY が見つかりません（.envまたは環境変数に設定してください）")


def analyze_youtube(url: str, mode: str = "full", model: str = DEFAULT_MODEL) -> str:
    """
    YouTube動画を解析して結果を返す。

    Args:
        url: YouTube動画のURL
        mode: "full" | "transcript" | "summary"
        model: 使用するGeminiモデル名

    Returns:
        解析結果のテキスト
    """
    key = load_api_key()
    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"

    prompt = PROMPTS.get(mode, PROMPTS["full"])

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "fileData": {
                            "mimeType": "video/*",
                            "fileUri": url
                        }
                    },
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "generationConfig": {
            "thinkingConfig": {
                "thinkingLevel": "LOW"
            },
            "mediaResolution": "MEDIA_RESOLUTION_LOW",
            "maxOutputTokens": 16384,
            "temperature": 0.3
        }
    }

    body = json.dumps(payload).encode()
    req = urllib.request.Request(
        api_url,
        data=body,
        headers={"Content-Type": "application/json"}
    )

    with urllib.request.urlopen(req, timeout=180) as r:
        data = json.loads(r.read())

    if "error" in data:
        raise RuntimeError(f"API Error {data['error']['code']}: {data['error']['message']}")

    text = ""
    for candidate in data.get("candidates", []):
        for part in candidate.get("content", {}).get("parts", []):
            if "text" in part:
                text += part["text"]

    finish_reason = ""
    for c in data.get("candidates", []):
        finish_reason = c.get("finishReason", "")

    if finish_reason == "MAX_TOKENS":
        text += "\n\n⚠️ 出力がトークン上限に達しました。内容が途中で切れている可能性があります。"

    return text


def main():
    parser = argparse.ArgumentParser(description="YouTube動画をGemini APIで解析")
    parser.add_argument("url", help="YouTube動画のURL")
    parser.add_argument("--model", default=DEFAULT_MODEL, help=f"使用モデル（デフォルト: {DEFAULT_MODEL}）")
    parser.add_argument("--mode", choices=["full", "transcript", "summary"], default="full",
                        help="解析モード（デフォルト: full）")
    args = parser.parse_args()

    print(f"🎬 YouTube動画解析中...")
    print(f"   URL: {args.url}")
    print(f"   モデル: {args.model}")
    print(f"   モード: {args.mode}")
    print()

    result = analyze_youtube(args.url, mode=args.mode, model=args.model)
    print(result)


if __name__ == "__main__":
    main()
