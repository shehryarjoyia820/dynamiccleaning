/**
 * ads.txt for Google AdSense. Set NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
 * in Vercel; the publisher ID below is derived from it.
 */
export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  const pub = client?.replace(/^ca-/, '');
  if (!pub || !/^pub-\d{10,20}$/.test(pub)) {
    return new Response('# AdSense not configured yet\n', { status: 404, headers: { 'Content-Type': 'text/plain' } });
  }
  return new Response(`google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
