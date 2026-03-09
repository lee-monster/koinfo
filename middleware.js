export default function middleware(request) {
  const host = request.headers.get('host') || '';

  if (host.startsWith('travel.')) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Allow static assets and API calls to pass through
    if (path.startsWith('/api/') || path.startsWith('/js/') || path.startsWith('/css/') ||
        path.startsWith('/sites/') || path.startsWith('/images/') || path.startsWith('/favicon') ||
        path === '/travel-index.html') {
      return;
    }

    // Rewrite to travel-index.html
    url.pathname = '/travel-index.html';
    return new Response(null, {
      status: 200,
      headers: { 'x-middleware-rewrite': url.toString() }
    });
  }
}

export const config = {
  matcher: '/((?!_vercel).*)'
};
