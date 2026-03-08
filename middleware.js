import { NextResponse } from 'next/server';

export function middleware(request) {
  const host = request.headers.get('host') || '';

  if (host.startsWith('travel.')) {
    const url = request.nextUrl.clone();
    const path = url.pathname;

    // Allow static assets and API calls to pass through
    if (path.startsWith('/api/') || path.startsWith('/js/') || path.startsWith('/css/') ||
        path.startsWith('/sites/') || path.startsWith('/images/') || path.startsWith('/favicon') ||
        path === '/travel-index.html') {
      return NextResponse.next();
    }

    // Rewrite to travel-index.html
    url.pathname = '/travel-index.html';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
