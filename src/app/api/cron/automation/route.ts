import { NextResponse, type NextRequest } from 'next/server';
import { runAutomations } from '@/lib/automation';
import { ensureSchema } from '@/lib/db-init';
import { serviceClient } from '@/lib/supabase/clients';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

/** Called every 10 minutes by Supabase pg_cron (see lib/scheduler.ts): runs the email automations. */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const db = serviceClient();
  if (!db) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  // Apply pending database upgrades first, so new automation features work without an admin visit.
  await ensureSchema();
  const result = await runAutomations(db, { maxMs: 50000 });
  console.log(`[automation] tick: ${result.automations.length} running, sent=${result.sent.sent} failed=${result.sent.failed}`);
  return NextResponse.json(result);
}
