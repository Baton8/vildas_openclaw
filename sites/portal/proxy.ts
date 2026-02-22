import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// App Router のルート一覧（これ以外はpublicのindex.htmlを探す）
const APP_ROUTES = ['/', '/diary'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 拡張子なし・App Routerのページでない・_nextでない
  // → /path/index.html にrewrite（publicの静的HTMLを配信）
  const hasExtension = pathname.includes('.');
  const isAppRoute = APP_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));
  const isInternal = pathname.startsWith('/_next') || pathname.startsWith('/api');

  if (!hasExtension && !isAppRoute && !isInternal && pathname !== '/') {
    const url = request.nextUrl.clone();
    // 末尾スラッシュを除いて /index.html を付ける
    url.pathname = pathname.replace(/\/$/, '') + '/index.html';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api).*)'],
};
