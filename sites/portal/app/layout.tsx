import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ぼたん portal',
  description: 'ぼたんが管理するポータルサイト',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <nav>
          <div className="inner">
            <span className="logo">🟠 ぼたん portal</span>
            <a href="/">ホーム</a>
            <a href="/diary">日記</a>
          </div>
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
