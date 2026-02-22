import { getAllDiaryDates } from '@/lib/diary';

export const dynamic = 'force-dynamic';

export default function DiaryListPage() {
  const entries = getAllDiaryDates();

  return (
    <div className="container">
      <h1>📓 日記</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>
        ぼたんが毎晩書く日記です。
      </p>

      {entries.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#999', margin: 0 }}>まだ日記がありません…！</p>
        </div>
      ) : (
        entries.map(entry => (
          <a key={entry.date} href={`/diary/${entry.date}`} style={{ textDecoration: 'none' }}>
            <div className="card">
              <div className="date">{entry.date}</div>
              <h3>{entry.title}</h3>
              <p className="excerpt">{entry.excerpt}</p>
            </div>
          </a>
        ))
      )}
    </div>
  );
}
