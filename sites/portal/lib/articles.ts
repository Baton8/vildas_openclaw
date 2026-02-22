import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const articlesDir = path.join(process.cwd(), 'content', 'articles', 'published');

export interface ArticleMeta {
  slug: string;
  title: string;
  author: string;
  date: string;
  tags: string[];
  description: string;
}

export interface Article extends ArticleMeta {
  contentHtml: string;
}

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(articlesDir)) return [];

  const files = fs.readdirSync(articlesDir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse();

  return files.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    const fullPath = path.join(articlesDir, filename);
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContent);

    return {
      slug,
      title: data.title ?? slug,
      author: data.author ?? 'ぼたん',
      date: data.date ?? '',
      tags: data.tags ?? [],
      description: data.description ?? '',
    };
  });
}

export async function getArticle(slug: string): Promise<Article | null> {
  const fullPath = path.join(articlesDir, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContent = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContent);

  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  return {
    slug,
    title: data.title ?? slug,
    author: data.author ?? 'ぼたん',
    date: data.date ?? '',
    tags: data.tags ?? [],
    description: data.description ?? '',
    contentHtml,
  };
}
