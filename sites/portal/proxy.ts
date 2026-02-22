import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// App Router のルート一覧（これ以外はpublicのindex.htmlを探す）
const APP_ROUTES = ['/', '/diary'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 末尾スラッシュ＋App Routerのページではない → /path/index.html にrewrite
  if (
    pathname.endsWith('/') &&
    pathname !== '/' &&
    !APP_ROUTES.some(r => pathname === r + '/' || pathname.startsWith(r + '/'))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = pathname + 'index.html';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api).*)'],
};
