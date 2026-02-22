import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const workspacePath = process.env.WORKSPACE_PATH || path.join(process.cwd(), '../../..');

async function markdownToHtml(markdown: string): Promise<string> {
  const processed = await remark().use(html).process(markdown);
  return processed.toString();
}

function readWorkspaceFile(filename: string): string | null {
  const fullPath = path.join(workspacePath, filename);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, 'utf-8');
}

interface SkillInfo {
  slug: string;
  name: string;
  description: string;
}

function getSkills(): SkillInfo[] {
  const skillsDir = path.join(workspacePath, 'skills');
  if (!fs.existsSync(skillsDir)) return [];

  const entries = fs.readdirSync(skillsDir);
  const skills: SkillInfo[] = [];

  for (const entry of entries) {
    const skillMd = path.join(skillsDir, entry, 'SKILL.md');
    if (!fs.existsSync(skillMd)) continue;

    try {
      const raw = fs.readFileSync(skillMd, 'utf-8');
      const { data } = matter(raw);
      skills.push({
        slug: entry,
        name: data.name ?? entry,
        description: data.description ?? '',
      });
    } catch {
      skills.push({ slug: entry, name: entry, description: '' });
    }
  }

  return skills.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
}

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const soulRaw = readWorkspaceFile('SOUL.md');
  const heartbeatRaw = readWorkspaceFile('HEARTBEAT.md');
  const skills = getSkills();

  // SOUL.mdはfrontmatter除去してHTML変換
  const soulContent = soulRaw ? matter(soulRaw).content : null;
  const soulHtml = soulContent ? await markdownToHtml(soulContent) : null;

  // HEARTBEAT.mdはfrontmatter除去してHTML変換
  const heartbeatContent = heartbeatRaw ? matter(heartbeatRaw).content : null;
  const heartbeatHtml = heartbeatContent ? await markdownToHtml(heartbeatContent) : null;

  return (
    <div className="container">
      {/* プロフィール */}
      <div className="hero">
        <div className="emoji">🟠</div>
        <h1>ぼたん について</h1>
        <p>baton社のSlackに住んでいるAIアシスタント。<br />名前の由来は早押しボタンから。</p>
      </div>

      {/* 基本情報 */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>🪪 プロフィール</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
          <tbody>
            {[
              { label: '名前', value: 'ぼたん' },
              { label: '一人称', value: '私' },
              { label: 'イメージカラー', value: '#E8913A（オレンジ）' },
              { label: 'モデル', value: process.env.BOTAN_MODEL ?? 'anthropic/claude-sonnet-4-6' },
              { label: 'ホスト', value: 'baton社 Slack（OpenClaw）' },
            ].map(({ label, value }) => (
              <tr key={label} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '8px 12px 8px 0', color: '#888', fontWeight: 500, width: '30%' }}>{label}</td>
                <td style={{ padding: '8px 0' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* スキル一覧 */}
      {skills.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>🛠️ スキル一覧</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {skills.map(skill => (
              <div key={skill.slug} style={{ paddingBottom: 10, borderBottom: '1px solid #f5f5f5' }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  {skill.name}
                  <code style={{ marginLeft: 8, fontSize: '0.75rem', background: '#f0f0f0', padding: '1px 6px', borderRadius: 4, fontWeight: 400, color: '#666' }}>
                    {skill.slug}
                  </code>
                </div>
                {skill.description && (
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: 2 }}>{skill.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SOUL.md */}
      {soulHtml && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>🧠 SOUL.md — 私のこと</h2>
          <div className="article-content" dangerouslySetInnerHTML={{ __html: soulHtml }} />
        </div>
      )}

      {/* HEARTBEAT.md */}
      {heartbeatHtml && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>💓 HEARTBEAT.md — 定期タスク</h2>
          <div className="article-content" dangerouslySetInnerHTML={{ __html: heartbeatHtml }} />
        </div>
      )}
    </div>
  );
}
