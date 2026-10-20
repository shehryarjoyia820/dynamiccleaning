import { NextResponse, type NextRequest } from 'next/server';
import { requireStaff } from '@/lib/admin';

export const dynamic = 'force-dynamic';

const COLS = ['email', 'name', 'company', 'phone', 'source', 'tags', 'status', 'replied_at', 'unsubscribed_at', 'created_at'] as const;

function cell(v: unknown) {
  let s = v == null ? '' : Array.isArray(v) ? v.join('; ') : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: NextRequest) {
  const { db } = await requireStaff();
  const sp = req.nextUrl.searchParams;
  const rows: Record<string, unknown>[] = [];
  for (let from = 0; ; from += 1000) {
    let q = db.from('contacts').select(COLS.join(',')).order('created_at', { ascending: false }).range(from, from + 999);
    if (sp.get('source')) q = q.eq('source', sp.get('source')!);
    if (sp.get('tag')) q = q.contains('tags', [sp.get('tag')!]);
    if (sp.get('status')) q = q.eq('status', sp.get('status')!);
    const { data, error } = await q;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    rows.push(...((data ?? []) as unknown as Record<string, unknown>[]));
    if (!data || data.length < 1000) break;
  }
  const csv = [COLS.join(','), ...rows.map((r) => COLS.map((c) => cell(r[c])).join(','))].join('\r\n');
  return new NextResponse('﻿' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="diesel-dynamix-contacts-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
