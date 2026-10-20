import { NextResponse, type NextRequest } from 'next/server';
import { processQueue } from '@/lib/campaigns';
import { serviceClient } from '@/lib/supabase/clients';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

/** Daily Vercel Cron (see vercel.json): sends due follow-ups and any leftover queue. */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const db = serviceClient();
  if (!db) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  const result = await processQueue(db, { maxMs: 50000 });
  return NextResponse.json(result);
}
