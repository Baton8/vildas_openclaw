import { getDiaryPost, getAllDiaryDates } from '@/lib/diary';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: { date: string };
}

export default async function DiaryPostPage({ params }: Props) {
  const post = await getDiaryPost(params.date);
  if (!post) notFound();

  return (
    <div className="container">
      <div style={{ marginBottom: 24 }}>
        <a href="/diary" style={{ fontSize: '0.9rem', color: '#999' }}>← 日記一覧</a>
      </div>

      <div className="card">
        <div className="date">{post.date}</div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 24 }}>{post.title}</h1>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </div>
    </div>
  );
}

// 静的生成用（任意）
export async function generateStaticParams() {
  const entries = getAllDiaryDates();
  return entries.map(e => ({ date: e.date }));
}
