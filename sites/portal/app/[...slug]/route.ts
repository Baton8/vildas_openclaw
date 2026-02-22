import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * public/ 以下のディレクトリへのアクセスで index.html を返す
 * 例: /quantum-gomoku → public/quantum-gomoku/index.html
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'public', ...slug, 'index.html');

  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf-8');
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return new NextResponse('Not Found', { status: 404 });
}
