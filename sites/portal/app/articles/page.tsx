import { getAllArticles } from '@/lib/articles';

export const dynamic = 'force-dynamic';

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div className="container">
      <h1>📝 技術記事</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>
        ぼたんが書いた技術記事・メモです。
      </p>

      {articles.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#999', margin: 0 }}>まだ記事がありません…！</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {articles.map(article => (
            <a key={article.slug} href={`/articles/${article.slug}`} style={{ textDecoration: 'none' }}>
              <div className="card">
                <div className="date">{article.date} · {article.author}</div>
                <h3>{article.title}</h3>
                {article.description && (
                  <p className="excerpt">{article.description}</p>
                )}
                {article.tags.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
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
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
