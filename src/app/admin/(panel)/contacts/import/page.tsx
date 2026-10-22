'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { CheckCircle2, FileUp, Loader2, Send } from 'lucide-react';
import { importContactRows, type ImportRow } from '../../email-actions';
import { AdminTitle } from '../../ui';

const BATCH = 1000;
const EMAIL = /[^\s@;,<>"'()]+@[^\s@;,<>"'()]+\.[a-z]{2,}/i;
const TIERS = [
  [1, '1 truck'],
  [2, '2–3 trucks'],
  [3, '4–10 trucks'],
  [4, '11+ trucks'],
] as const;

const tierOf = (n: number | null | undefined) => {
  const t = Number(n) || 0;
  return t <= 1 ? 1 : t <= 3 ? 2 : t <= 10 ? 3 : 4;
};

/** RFC-4180 CSV: quoted cells may hold commas, quotes ("") and line breaks. */
function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = '';
  let q = false;
  const t = text.replace(/^﻿/, '');
  // Delimiter from the first line, so a ";" inside a cell (two emails) never splits columns in a comma file.
  const nl = t.search(/\r?\n/);
  const first = nl >= 0 ? t.slice(0, nl) : t;
  const count = (d: string) => first.split(d).length;
  const delim = count('\t') > count(',') ? '\t' : count(';') > count(',') ? ';' : ',';
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (q) {
      if (ch === '"') {
        if (t[i + 1] === '"') {
          cur += '"';
          i++;
        } else q = false;
      } else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === delim) {
      row.push(cur);
      cur = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && t[i + 1] === '\n') i++;
      row.push(cur);
      if (row.some((c) => c.trim())) rows.push(row);
      row = [];
      cur = '';
    } else cur += ch;
  }
  row.push(cur);
  if (row.some((c) => c.trim())) rows.push(row);
  return rows;
}

type Parsed = { rows: ImportRow[]; skipped: number; duplicates: number; tiers: Record<number, number> };

/** Maps any CSV (or a plain list of emails) to contacts; extra columns are kept as details. */
function toContacts(text: string): Parsed {
  const table = parseCsv(text);
  const head = (table[0] ?? []).map((h) => h.trim());
  const lower = head.map((h) => h.toLowerCase());
  const hasHeader = lower.some((h) => /e-?mail/.test(h));
  const find = (...res: RegExp[]) => {
    for (const re of res) {
      const i = lower.findIndex((h) => re.test(h));
      if (i >= 0) return i;
    }
    return -1;
  };
  const ci = {
    email: hasHeader ? find(/^e-?mail/, /e-?mail/) : -1,
    name: find(/^contact/, /^(full )?name$/, /officer|owner/),
    company: find(/^company/, /legal name|carrier name|business|organi[sz]ation/),
    phone: find(/phone|mobile|^tel/),
    trucks: find(/power units/, /^trucks?$|fleet size|# of trucks|number of trucks/, /tractors/),
  };
  const used = new Set(Object.values(ci).filter((i) => i >= 0));
  const byEmail = new Map<string, ImportRow>();
  let skipped = 0;
  let duplicates = 0;

  for (const cells of hasHeader ? table.slice(1) : table) {
    const raw = ci.email >= 0 ? cells[ci.email] ?? '' : cells.join(' ');
    const email = raw.match(EMAIL)?.[0].toLowerCase().replace(/[.]+$/, '');
    if (!email) {
      skipped++;
      continue;
    }
    const num = (i: number) => (i >= 0 ? parseInt(String(cells[i] ?? '').replace(/[^\d]/g, ''), 10) : NaN);
    let trucks = num(ci.trucks);
    if (!(trucks > 0)) trucks = num(find(/tractors/));
    const details: Record<string, string> = {};
    if (hasHeader) head.forEach((h, i) => {
      const v = (cells[i] ?? '').trim();
      if (v && !used.has(i)) details[h] = v;
    });
    const row: ImportRow = {
      email,
      name: ci.name >= 0 ? cells[ci.name]?.trim() || null : null,
      company: ci.company >= 0 ? cells[ci.company]?.trim() || null : null,
      phone: ci.phone >= 0 ? cells[ci.phone]?.trim() || null : null,
      trucks: trucks > 0 ? trucks : null,
      details,
    };
    const prev = byEmail.get(email);
    if (prev) {
      duplicates++;
      // Same email on several records (fleet HQ): keep the biggest fleet.
      if ((row.trucks ?? 0) > (prev.trucks ?? 0)) byEmail.set(email, row);
    } else byEmail.set(email, row);
  }
  const rows = [...byEmail.values()];
  const tiers: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const r of rows) tiers[tierOf(r.trucks)]++;
  return { rows, skipped, duplicates, tiers };
}

export default function ImportPage() {
  const [list, setList] = useState('');
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [fileName, setFileName] = useState('');
  const [reading, setReading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [progress, setProgress] = useState<{ done: number; inserted: number; updated: number } | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const [finished, setFinished] = useState(false);
  const paste = useRef<HTMLTextAreaElement>(null);

  const load = (text: string, name: string) => {
    setError('');
    setFinished(false);
    setProgress(null);
    const p = toContacts(text);
    setParsed(p);
    setFileName(name);
    if (!list) setList(name.replace(/\.[a-z]+$/i, '').replace(/[_-]+/g, ' ').slice(0, 60));
  };

  const run = async () => {
    if (!parsed?.rows.length) return;
    if (!list.trim()) return setError('Give this upload a list name.');
    if (!confirm) return setError('Please confirm you are allowed to email these contacts.');
    setError('');
    setRunning(true);
    let inserted = 0;
    let updated = 0;
    try {
      for (let i = 0; i < parsed.rows.length; i += BATCH) {
        const res = await importContactRows(list, parsed.rows.slice(i, i + BATCH));
        if (res.error) throw new Error(res.error);
        inserted += res.inserted;
        updated += res.updated;
        setProgress({ done: Math.min(i + BATCH, parsed.rows.length), inserted, updated });
      }
      setFinished(true);
    } catch (e) {
      setError(`Stopped: ${(e as Error).message}. Contacts imported so far are saved; run the upload again to finish (nothing is duplicated).`);
    } finally {
      setRunning(false);
    }
  };

  const total = parsed?.rows.length ?? 0;
  const pct = progress && total ? Math.round((progress.done / total) * 100) : 0;
  const listHref = `/admin/contacts?list=${encodeURIComponent(list.trim())}`;

  return (
    <>
      <AdminTitle title="Upload leads" />
      <div className="card grid max-w-3xl gap-5">
        <div>
          <label htmlFor="list" className="label">List name</label>
          <input id="list" value={list} onChange={(e) => setList(e.target.value)} maxLength={60} placeholder="e.g. Southern Leads" className="field max-w-sm" />
          <p className="mt-1 text-sm text-muted">Shown on the Contacts page; you can email this list by priority.</p>
        </div>

        <div>
          <span className="label">CSV file</span>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-ink/20 p-5 hover:border-accent-ink">
            {reading ? <Loader2 className="h-6 w-6 animate-spin text-accent-ink" aria-hidden /> : <FileUp className="h-6 w-6 text-accent-ink" aria-hidden />}
            <span>
              <span className="font-semibold">{fileName || 'Choose a CSV file'}</span>
              <span className="block text-sm text-muted">Any size. Columns are detected from the header: email, company, contact, phone, power units / trucks.</span>
            </span>
            <input
              type="file"
              accept=".csv,.txt,text/csv,text/plain"
              className="sr-only"
              disabled={running}
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setReading(true);
                load(await f.text(), f.name);
                setReading(false);
              }}
            />
          </label>
          <details className="mt-3 text-sm">
            <summary className="cursor-pointer font-semibold">…or paste emails</summary>
            <textarea ref={paste} rows={6} className="field mt-2 font-mono text-sm" placeholder={'email,name,company,trucks\njohn@acmetrucking.com,John Smith,Acme Trucking,4'} />
            <button type="button" className="mt-2 rounded-md border border-ink/20 px-3 py-1.5 font-semibold" onClick={() => paste.current?.value.trim() && load(paste.current.value, 'Pasted list')}>
              Read pasted list
            </button>
          </details>
        </div>

        {parsed ? (
          <div className="rounded-lg bg-offwhite p-4">
            <p className="font-semibold">
              {total.toLocaleString()} contacts ready
              <span className="font-normal text-muted">
                {' '}· {parsed.duplicates.toLocaleString()} duplicate emails merged · {parsed.skipped.toLocaleString()} rows without a valid email skipped
              </span>
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {TIERS.map(([t, hint]) => (
                <div key={t} className="rounded-md bg-white p-3">
                  <dt className="text-xs font-semibold uppercase text-muted">Priority {t} · {hint}</dt>
                  <dd className="font-display text-2xl font-bold tabular-nums">{parsed.tiers[t].toLocaleString()}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} className="mt-1 h-4 w-4" />
          <span>
            I confirm these are business contacts Diesel Dynamix may email. Every email includes an unsubscribe link and our address (US CAN-SPAM). People who already
            unsubscribed are never emailed again.
          </span>
        </label>

        <button type="button" onClick={run} className="btn-primary justify-self-start !min-h-[44px]" disabled={running || !total || finished}>
          {running ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : null}
          {running ? `Importing… ${pct}%` : `Import ${total ? total.toLocaleString() : ''} contacts`}
        </button>

        {progress ? (
          <div role="status" aria-live="polite">
            <div className="h-2 overflow-hidden rounded-full bg-ink/10">
              <div className="h-full bg-accent-deep transition-[width]" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-sm text-muted">
              {progress.done.toLocaleString()} of {total.toLocaleString()} · {progress.inserted.toLocaleString()} new · {progress.updated.toLocaleString()} already in Contacts (updated)
            </p>
          </div>
        ) : null}

        {error ? <p className="rounded-lg bg-[#FEE4E2] p-4 font-semibold text-[#912018]">{error}</p> : null}

        {finished ? (
          <div className="rounded-lg bg-green/10 p-4">
            <p className="flex items-center gap-2 font-semibold text-green-ink">
              <CheckCircle2 className="h-5 w-5" aria-hidden /> Import complete: {list}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href={listHref} className="rounded-md bg-charcoal px-4 py-2 text-sm font-semibold text-white">View the list</Link>
              <Link href={`/admin/emails/campaigns/new?list=${encodeURIComponent(list.trim())}`} className="inline-flex items-center gap-2 rounded-md bg-accent-deep px-4 py-2 text-sm font-bold text-white hover:bg-accent-hover">
                <Send className="h-4 w-4" aria-hidden /> Email by priority
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
