import { NextResponse, type NextRequest } from 'next/server';
import { verifyUnsubscribe } from '@/lib/campaigns';
import { serviceClient } from '@/lib/supabase/clients';

export const runtime = 'nodejs';

/** RFC 8058 one-click unsubscribe (mail apps POST here from the List-Unsubscribe header). */
export async function POST(req: NextRequest) {
  const c = req.nextUrl.searchParams.get('c') ?? '';
  const t = req.nextUrl.searchParams.get('t') ?? '';
  if (!verifyUnsubscribe(c, t)) return NextResponse.json({ error: 'Invalid link' }, { status: 400 });
  const db = serviceClient();
  if (!db) return NextResponse.json({ error: 'Unavailable' }, { status: 503 });
  await db.from('contacts').update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() }).eq('id', c);
  await db.from('email_sends').update({ status: 'cancelled', error: 'Unsubscribed' }).eq('contact_id', c).eq('status', 'queued');
  return NextResponse.json({ ok: true });
}

export function GET(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = '/unsubscribe';
  return NextResponse.redirect(url);
}
