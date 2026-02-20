# YouTube動画解析スキル

YouTubeのURLが渡されたとき、Gemini APIを使って動画を解析する。

## いつ使うか

- 「この動画解析して」
- 「テロップ書き起こして」
- 「動画の内容まとめて」
- SlackなどにYouTubeのURLが貼られて解析を頼まれたとき

## 使い方

### コマンドライン
```bash
python3 /workspace/tools/youtube_analyze.py <YouTube URL> [--mode full|transcript|summary]
```

### Pythonから呼び出す
```python
import sys
sys.path.insert(0, '/workspace/tools')
from youtube_analyze import analyze_youtube

result = analyze_youtube(
    url="https://www.youtube.com/watch?v=...",
    mode="full",           # "full" | "transcript" | "summary"
    model="gemini-3.1-pro-preview"
)
print(result)
```

## モード

| モード | 内容 |
|--------|------|
| `full` | タイトル・出演者・概要・テロップ全て（デフォルト） |
| `transcript` | テロップ・発言の書き起こしのみ（タイムスタンプ付き） |
| `summary` | タイトル・出演者・内容概要のみ |

## 技術メモ

- モデル: `gemini-3.1-pro-preview`（必須。他のモデルでは新規ユーザー制限等あり）
- `mimeType: "video/*"` を指定すること（これがないと失敗する）
- `mediaResolution: "MEDIA_RESOLUTION_LOW"` でコスト節約
- `thinkingLevel: "LOW"` で高速化
- タイムアウト: 180秒（長尺動画は時間かかる）
- APIキー: `.env` の `GOOGLE_API_KEY` を使用

## 出力例

```
### 1. 動画タイトル
「n→2n」無限ポケットリュック（QuizKnockと学ぼう）

### 2. 出演者・登場人物
- 鶴崎修功
- 東言

### 3. 内容概要
QuizKnockの...

### 4. テロップ書き起こし
00:00 ついにこのホテルは…
00:02 え？
...
```

## 注意事項

- 非公開動画・年齢制限動画は解析できない場合がある
- 非常に長い動画（1時間以上）はMAX_TOKENSに達する可能性あり
- テロップが少ない動画は書き起こしの精度が下がる場合がある
