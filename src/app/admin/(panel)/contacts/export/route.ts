import { NextResponse, type NextRequest } from 'next/server';
import { requireStaff } from '@/lib/admin';
import { contactCity } from '@/lib/campaigns';
import { applyFilter, readFilter } from '@/lib/contact-filter';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type Row = Record<string, unknown> & { details?: Record<string, string> | null };

// Columns in the CSV: [header, value]. Fleet details come from the imported list.
const COLUMNS: [string, (r: Row) => unknown][] = [
  ['email', (r) => r.email],
  ['company', (r) => r.company],
  ['contact', (r) => r.name],
  ['phone', (r) => r.phone],
  ['priority', (r) => (r.priority ? `P${r.priority}` : '')],
  ['trucks', (r) => r.trucks],
  ['city', (r) => contactCity(r.details)],
  ['zip', (r) => r.details?.ZIP],
  ['county', (r) => r.details?.County],
  ['address', (r) => r.details?.['Street Address']],
  ['usdot', (r) => r.details?.['USDOT #']],
  ['mc', (r) => r.details?.['MC #']],
  ['carrier_type', (r) => r.details?.['Carrier Type']],
  ['list', (r) => r.list_name],
  ['source', (r) => r.source],
  ['tags', (r) => r.tags],
  ['status', (r) => r.status],
  ['replied_at', (r) => r.replied_at],
  ['unsubscribed_at', (r) => r.unsubscribed_at],
  ['created_at', (r) => r.created_at],
];

function cell(v: unknown) {
  let s = v == null ? '' : Array.isArray(v) ? v.join('; ') : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // keep spreadsheets from running formulas
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** CSV of exactly what the Contacts page shows (list, priority, search by city/ZIP, ...), streamed in pages. */
export async function GET(req: NextRequest) {
  const { db } = await requireStaff();
  const sp = req.nextUrl.searchParams;
  const filter = readFilter((k) => sp.get(k));

  // Older databases (before lists/priority) don't have the fleet columns yet.
  const probe = await db.from('contacts').select('priority').limit(1);
  const withPriority = !probe.error;
  const select = withPriority
    ? 'email,name,company,phone,priority,trucks,list_name,details,source,tags,status,replied_at,unsubscribed_at,created_at'
    : 'email,name,company,phone,source,tags,status,replied_at,unsubscribed_at,created_at';

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(enc.encode('﻿' + COLUMNS.map(([h]) => h).join(',') + '\r\n'));
      for (let from = 0; ; from += 1000) {
        let q = db.from('contacts').select(select);
        q = withPriority ? q.order('priority').order('trucks', { ascending: false, nullsFirst: false }).order('id') : q.order('created_at', { ascending: false });
        q = applyFilter(q, filter, withPriority).range(from, from + 999);
        const { data, error } = await q;
        if (error) {
          controller.enqueue(enc.encode(`\r\nERROR: ${error.message}\r\n`));
          break;
        }
        const rows = (data ?? []) as unknown as Row[];
        if (rows.length) controller.enqueue(enc.encode(rows.map((r) => COLUMNS.map(([, v]) => cell(v(r))).join(',')).join('\r\n') + '\r\n'));
        if (rows.length < 1000) break;
      }
      controller.close();
    },
  });

  const name = ['diesel-dynamix', filter.list, filter.q, filter.p ? `p${filter.p}` : '', new Date().toISOString().slice(0, 10)]
    .filter(Boolean)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-');
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${name}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
