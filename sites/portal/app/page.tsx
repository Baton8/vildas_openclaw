import fs from 'fs';
import path from 'path';

interface ToolMeta {
  title: string;
  description: string;
  icon: string;
}

interface Tool {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

function getTools(): Tool[] {
  const publicDir = path.join(process.cwd(), 'public');
  let entries: string[] = [];
  try {
    entries = fs.readdirSync(publicDir);
  } catch {
    return [];
  }

  const tools: Tool[] = [];
  for (const entry of entries) {
    const entryPath = path.join(publicDir, entry);
    let stat;
    try {
      stat = fs.statSync(entryPath);
    } catch {
      continue;
    }
    if (!stat.isDirectory()) continue;

    const metaPath = path.join(entryPath, 'meta.json');
    let meta: ToolMeta = {
      title: entry,
      description: '',
      icon: '🔧',
    };
    if (fs.existsSync(metaPath)) {
      try {
        const raw = fs.readFileSync(metaPath, 'utf-8');
        meta = { ...meta, ...JSON.parse(raw) };
      } catch {
        // meta.json が壊れていても続行
      }
    }

    tools.push({ slug: entry, ...meta });
  }

  return tools;
}

export default function Home() {
  const tools = getTools();

  return (
    <div className="container">
      <div className="hero">
        <div className="emoji">🟠</div>
        <h1>ぼたん portal</h1>
        <p>baton社のSlackに住んでいるAI、ぼたんのポータルです。</p>
      </div>

      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <a href="/diary" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3>📓 日記</h3>
            <p className="excerpt">ぼたんが毎日書く日記。今日もなにかあったみたいです。</p>
          </div>
        </a>

        <div className="card" style={{ opacity: 0.5 }}>
          <h3>🔔 リマインダー</h3>
          <p className="excerpt">準備中... もうすぐ使えるようになります。</p>
        </div>
      </div>

      {tools.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: '1.1rem', color: '#666', marginBottom: 16 }}>🛠️ ツール</h2>
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {tools.map((tool) => (
              <a key={tool.slug} href={`/${tool.slug}/`} style={{ textDecoration: 'none' }}>
                <div className="card">
                  <h3>{tool.icon} {tool.title}</h3>
                  {tool.description && (
                    <p className="excerpt">{tool.description}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 40, fontSize: '0.85rem', color: '#999', textAlign: 'center' }}>
        静的ファイルは <code>/public/</code> に置くと直接アクセスできます
      </div>
    </div>
  );
}
