import { NextResponse, type NextRequest } from 'next/server';
import { LEAD_STATUSES, requireStaff } from '@/lib/admin';

export const dynamic = 'force-dynamic';

const COLS = [
  'created_at', 'kind', 'status', 'full_name', 'company', 'phone', 'email', 'trucks', 'location',
  'engine_type', 'preferred_date', 'appointment_at', 'notes', 'message', 'source_page',
] as const;

function cell(v: unknown) {
  let s = v == null ? '' : String(v);
  // Neutralise spreadsheet formula injection.
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: NextRequest) {
  const { db } = await requireStaff();
  const status = req.nextUrl.searchParams.get('status');
  const rows: Record<string, unknown>[] = [];
  // Page through everything (Supabase caps a single response at 1000 rows).
  for (let from = 0; ; from += 1000) {
    let q = db.from('leads').select(COLS.join(',')).order('created_at', { ascending: false }).range(from, from + 999);
    if (status && LEAD_STATUSES.includes(status as never)) q = q.eq('status', status);
    const { data, error } = await q;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    rows.push(...((data ?? []) as unknown as Record<string, unknown>[]));
    if (!data || data.length < 1000) break;
  }
  const csv = [COLS.join(','), ...rows.map((r) => COLS.map((c) => cell(r[c])).join(','))].join('\r\n');
  return new NextResponse('﻿' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="diesel-dynamix-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
