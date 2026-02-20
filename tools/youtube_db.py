#!/usr/bin/env python3
"""
YouTube動画解析 → DB保存ツール

YouTube URLを渡すと解析してDBに保存する。
動画を調査したついでに使う想定。

使い方:
  python3 tools/youtube_db.py <YouTube URL> --channel-id <channel_id>

例:
  python3 tools/youtube_db.py https://www.youtube.com/watch?v=xxxxx --channel-id quizknock-main
  python3 tools/youtube_db.py https://www.youtube.com/watch?v=xxxxx --channel-id sugai-shunki

channel_idはdata/youtube/channels.jsonの"id"フィールドを指定。
省略した場合はURLのみ保存（channel_id: unknown）。
"""

import sys
import os
import json
import re
import argparse
from datetime import datetime

# tools/ と同じ場所にあるyoutube_analyze.pyを使う
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from youtube_analyze import analyze_youtube

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "youtube")
TRANSCRIPTS_DIR = os.path.join(DATA_DIR, "transcripts")
VIDEOS_JSONL = os.path.join(DATA_DIR, "videos.jsonl")


def extract_video_id(url: str) -> str:
    """YouTube URLからvideo_idを抽出"""
    m = re.search(r'(?:v=|youtu\.be/)([A-Za-z0-9_\-]{11})', url)
    if m:
        return m.group(1)
    raise ValueError(f"video_idが取得できませんでした: {url}")


def is_already_analyzed(video_id: str) -> bool:
    """すでに解析済みかチェック"""
    path = os.path.join(TRANSCRIPTS_DIR, f"{video_id}.json")
    return os.path.exists(path)


def load_channels() -> dict:
    """channels.jsonを読み込む"""
    path = os.path.join(DATA_DIR, "channels.json")
    with open(path) as f:
        data = json.load(f)
    return {c["id"]: c for c in data.get("channels", [])}


def parse_transcript(raw_text: str) -> list:
    """
    Geminiの生出力からタイムスタンプ付きテロップリストを抽出する。
    形式: 00:00 テキスト
    """
    lines = raw_text.split("\n")
    transcript = []
    for line in lines:
        m = re.match(r'^(\d{1,2}:\d{2})\s+(.+)', line.strip())
        if m:
            transcript.append({"time": m.group(1), "text": m.group(2)})
    return transcript


def extract_title_from_raw(raw_text: str) -> str:
    """生出力から動画タイトルを抽出（ベストエフォート）"""
    m = re.search(r'動画タイトル[^\n]*\n+[*#\-\s]*(.+)', raw_text)
    if m:
        return m.group(1).strip().lstrip("「」")
    return ""


def extract_performers_from_raw(raw_text: str) -> list:
    """生出力から出演者リストを抽出（ベストエフォート）"""
    m = re.search(r'出演者[^\n]*\n+([\s\S]+?)(?:\n\n|\d\.|###)', raw_text)
    if not m:
        return []
    block = m.group(1)
    performers = []
    for line in block.split("\n"):
        line = line.strip().lstrip("*-・").strip()
        if line and len(line) < 30:
            performers.append(line)
    return performers


def save_to_db(video_id: str, channel_id: str, raw_text: str, model: str, url: str):
    """解析結果をDBに保存"""
    os.makedirs(TRANSCRIPTS_DIR, exist_ok=True)

    today = datetime.now().strftime("%Y-%m-%d")
    transcript = parse_transcript(raw_text)
    title = extract_title_from_raw(raw_text)
    performers = extract_performers_from_raw(raw_text)

    # transcripts/{video_id}.json
    transcript_data = {
        "video_id": video_id,
        "channel_id": channel_id,
        "url": url,
        "title": title,
        "performers": performers,
        "transcript": transcript,
        "raw": raw_text,
        "analyzed_at": today,
        "model": model
    }
    transcript_path = os.path.join(TRANSCRIPTS_DIR, f"{video_id}.json")
    with open(transcript_path, "w", encoding="utf-8") as f:
        json.dump(transcript_data, f, ensure_ascii=False, indent=2)
    print(f"✅ Transcript saved: {transcript_path}")

    # videos.jsonl に追記（コメント行はスキップ）
    existing_ids = set()
    if os.path.exists(VIDEOS_JSONL):
        with open(VIDEOS_JSONL) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    try:
                        existing_ids.add(json.loads(line)["video_id"])
                    except Exception:
                        pass

    if video_id not in existing_ids:
        video_entry = {
            "video_id": video_id,
            "channel_id": channel_id,
            "url": url,
            "title": title,
            "analyzed_at": today,
            "has_transcript": len(transcript) > 0
        }
        with open(VIDEOS_JSONL, "a", encoding="utf-8") as f:
            f.write(json.dumps(video_entry, ensure_ascii=False) + "\n")
        print(f"✅ videos.jsonl updated")
    else:
        print(f"ℹ️  videos.jsonl: すでに登録済み (video_id: {video_id})")


def main():
    parser = argparse.ArgumentParser(description="YouTube動画を解析してDBに保存")
    parser.add_argument("url", help="YouTube動画のURL")
    parser.add_argument("--channel-id", default="unknown", help="channels.jsonのid (省略可)")
    parser.add_argument("--model", default="gemini-3.1-pro-preview", help="使用モデル")
    parser.add_argument("--mode", choices=["full", "transcript", "summary"], default="full")
    parser.add_argument("--force", action="store_true", help="解析済みでも上書き")
    args = parser.parse_args()

    # URLのtパラメータを除いたクリーンなURLを作る
    url_clean = re.sub(r'&?t=\d+s?', '', args.url).rstrip('?')

    video_id = extract_video_id(url_clean)
    print(f"🎬 video_id: {video_id}")
    print(f"📁 channel_id: {args.channel_id}")

    if is_already_analyzed(video_id) and not args.force:
        print(f"⏭️  すでに解析済みです。上書きするには --force を指定してください。")
        return

    print(f"🔍 解析中... (model: {args.model}, mode: {args.mode})")
    raw = analyze_youtube(url_clean, mode=args.mode, model=args.model)

    save_to_db(video_id, args.channel_id, raw, args.model, url_clean)
    print("\n📝 解析結果プレビュー（先頭500文字）:")
    print(raw[:500])


if __name__ == "__main__":
    main()
