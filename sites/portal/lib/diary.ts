import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const workspacePath = process.env.WORKSPACE_PATH || path.join(process.cwd(), '../../..');
const diaryDir = path.join(workspacePath, 'memory', 'diary');

export interface DiaryEntry {
  date: string;
  title: string;
  excerpt: string;
}

export interface DiaryPost {
  date: string;
  title: string;
  contentHtml: string;
}

export function getAllDiaryDates(): DiaryEntry[] {
  if (!fs.existsSync(diaryDir)) return [];

  const files = fs.readdirSync(diaryDir)
    .filter(f => f.match(/^\d{4}-\d{2}-\d{2}\.md$/) && !f.startsWith('WIP_'))
    .sort()
    .reverse();

  return files.map(filename => {
    const date = filename.replace('.md', '');
    const fullPath = path.join(diaryDir, filename);
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    const { content } = matter(fileContent);

    // 最初の100文字を抜粋として使用
    const excerpt = content.replace(/^#.*\n/m, '').trim().slice(0, 100) + '…';

    return { date, title: `${date} の日記`, excerpt };
  });
}

export async function getDiaryPost(date: string): Promise<DiaryPost | null> {
  const fullPath = path.join(diaryDir, `${date}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContent = fs.readFileSync(fullPath, 'utf8');
  const { content } = matter(fileContent);

  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  return { date, title: `${date} の日記`, contentHtml };
}
