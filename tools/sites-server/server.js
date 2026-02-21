#!/usr/bin/env node
/**
 * ぼたんの静的ファイルサーバー
 * ファイルベースルーティングで ~/sites/ 以下を配信する
 * ルート (/) はツール一覧ページを自動生成
 */

const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const SITES_DIR = process.env.SITES_DIR || path.join(process.env.HOME, 'sites')
const PORT = parseInt(process.env.PORT || '4126', 10)

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
}

function generateIndex (sitesDir) {
  let tools = []
  try {
    tools = fs.readdirSync(sitesDir)
      .filter(name => {
        if (name.startsWith('.')) return false
        const stat = fs.statSync(path.join(sitesDir, name))
        return stat.isDirectory()
      })
      .sort()
      .map(name => {
        // Read meta.json if exists for display name / description
        let meta = {}
        try {
          meta = JSON.parse(fs.readFileSync(path.join(sitesDir, name, 'meta.json'), 'utf-8'))
        } catch (e) { /* ignore */ }
        return { name, title: meta.title || name, description: meta.description || '', icon: meta.icon || '🧰' }
      })
  } catch (e) { /* ignore if SITES_DIR not ready */ }

  const toolCards = tools.map(t => `
    <a href="/${t.name}/" class="card">
      <span class="icon">${t.icon}</span>
      <span class="title">${t.title}</span>
      ${t.description ? `<span class="desc">${t.description}</span>` : ''}
    </a>`).join('\n')

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ツール一覧 | baton</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f8f8f6;
      color: #1a1a1a;
      min-height: 100vh;
    }
    header {
      background: #fff;
      border-bottom: 1px solid #e8e8e8;
      padding: 20px 40px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    header .logo { font-size: 1.5rem; font-weight: 700; }
    header .sub { color: #888; font-size: 0.9rem; }
    main {
      max-width: 1000px;
      margin: 0 auto;
      padding: 48px 24px;
    }
    h1 { font-size: 1.6rem; margin-bottom: 8px; }
    .subtitle { color: #666; margin-bottom: 36px; font-size: 0.95rem; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }
    .card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 28px 16px;
      background: #fff;
      border-radius: 16px;
      text-decoration: none;
      color: inherit;
      border: 1px solid #e8e8e8;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    }
    .icon { font-size: 2.2rem; margin-bottom: 10px; }
    .title { font-weight: 600; font-size: 0.95rem; }
    .desc { color: #888; font-size: 0.8rem; margin-top: 4px; line-height: 1.4; }
    .empty {
      grid-column: 1 / -1;
      text-align: center;
      padding: 80px 20px;
      color: #aaa;
    }
    .empty p { margin-top: 12px; font-size: 0.9rem; }
  </style>
</head>
<body>
  <header>
    <span class="logo">🛠️ baton tools</span>
    <span class="sub">— 社内ツール一覧</span>
  </header>
  <main>
    <h1>ツール一覧</h1>
    <p class="subtitle">${tools.length} 個のツールが利用可能です</p>
    <div class="grid">
      ${tools.length ? toolCards : '<div class="empty"><span style="font-size:3rem">📭</span><p>まだツールがありません</p></div>'}
    </div>
  </main>
</body>
</html>`
}

function serveFile (filePath, res) {
  const ext = path.extname(filePath).toLowerCase()
  const contentType = MIME_TYPES[ext] || 'application/octet-stream'
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end('500 Internal Server Error')
      return
    }
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(data)
  })
}

const server = http.createServer((req, res) => {
  let pathname
  try {
    pathname = decodeURIComponent(url.parse(req.url).pathname)
  } catch (e) {
    res.writeHead(400)
    res.end('Bad Request')
    return
  }

  // Security: prevent directory traversal
  const safePathname = path.normalize(pathname).replace(/^(\.\.[\\/])+/, '')
  const filePath = path.join(SITES_DIR, safePathname)

  // Ensure the resolved path is inside SITES_DIR
  if (!filePath.startsWith(SITES_DIR + path.sep) && filePath !== SITES_DIR) {
    res.writeHead(403, { 'Content-Type': 'text/plain' })
    res.end('403 Forbidden')
    return
  }

  // Root → auto-generated tool list
  if (safePathname === '/' || safePathname === '') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(generateIndex(SITES_DIR))
    return
  }

  fs.stat(filePath, (err, stat) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('404 Not Found')
      return
    }

    if (stat.isDirectory()) {
      // Redirect /foo → /foo/
      if (!pathname.endsWith('/')) {
        res.writeHead(301, { Location: pathname + '/' })
        res.end()
        return
      }
      // Try index.html
      const indexPath = path.join(filePath, 'index.html')
      fs.access(indexPath, fs.constants.R_OK, (err2) => {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/plain' })
          res.end('404 Not Found')
          return
        }
        serveFile(indexPath, res)
      })
      return
    }

    serveFile(filePath, res)
  })
})

server.listen(PORT, () => {
  console.log(`✅ Static file server running at http://localhost:${PORT}`)
  console.log(`📁 Serving files from: ${SITES_DIR}`)
  console.log(`🕐 Started at ${new Date().toISOString()}`)
})

server.on('error', (err) => {
  console.error('❌ Server error:', err.message)
  process.exit(1)
})
