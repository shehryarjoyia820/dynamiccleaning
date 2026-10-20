import { type NextRequest } from 'next/server';
import { serviceClient } from '@/lib/supabase/clients';

export const runtime = 'nodejs';

const GIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Email open tracking pixel: counts every open and keeps the first-open time. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = serviceClient();
  if (db && UUID.test(id)) {
    // Counts every open; falls back to first-open only if the upgrade is not applied yet.
    const { error } = await db.rpc('track_open', { send_id: id });
    if (error) await db.from('email_sends').update({ opened_at: new Date().toISOString() }).eq('id', id).is('opened_at', null);
  }
  return new Response(GIF, {
    headers: { 'Content-Type': 'image/gif', 'Cache-Control': 'no-store, max-age=0' },
  });
}
