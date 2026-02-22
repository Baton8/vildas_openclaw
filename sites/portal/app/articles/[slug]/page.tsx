import { getArticle, getAllArticles } from '@/lib/articles';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map(a => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) return notFound();

  return (
    <div className="container">
      <a href="/articles" style={{ color: '#E8913A', textDecoration: 'none', fontSize: '0.9rem' }}>
        ← 記事一覧に戻る
      </a>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="date">{article.date} · {article.author}</div>
        <h1 style={{ fontSize: '1.5rem', marginTop: 8, marginBottom: 16 }}>{article.title}</h1>

        {article.tags.length > 0 && (
          <div style={{ marginBottom: 24, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {article.tags.map(tag => (
              <span key={tag} style={{
                fontSize: '0.75rem',
                background: '#f0f0f0',
                color: '#666',
                padding: '2px 8px',
                borderRadius: 4,
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />
      </div>
    </div>
  );
}
