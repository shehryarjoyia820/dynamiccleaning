import Link from 'next/link';
import { Bot, Download, Send, Upload } from 'lucide-react';
import { requireStaff } from '@/lib/admin';
import { PRIORITIES, contactCity } from '@/lib/campaigns';
import { cn } from '@/lib/utils';
import { deleteContacts, saveContact } from '../email-actions';
import { BulkForm, RowCheck } from '../bulk-form';
import { AdminTitle, SmallButton } from '../ui';

export const metadata = { title: 'Contacts' };

const PAGE = 50;

type Row = {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  phone: string | null;
  source: string;
  tags: string[];
  status: string;
  replied_at: string | null;
  created_at: string;
  priority?: number;
  trucks?: number | null;
  list_name?: string;
  details?: Record<string, string>;
};

const PRIO_STYLE: Record<number, string> = {
  1: 'bg-ink/10 text-ink',
  2: 'bg-accent/15 text-accent-ink',
  3: 'bg-[#FEF0C7] text-[#7A4A06]',
  4: 'bg-green/15 text-green-ink',
};

/** Page numbers with gaps: 1 … 4 5 [6] 7 8 … 120 */
function pageList(current: number, total: number) {
  const set = new Set([0, total - 1, current - 2, current - 1, current, current + 1, current + 2].filter((n) => n >= 0 && n < total));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | 'gap')[] = [];
  sorted.forEach((n, i) => {
    if (i && n - sorted[i - 1] > 1) out.push('gap');
    out.push(n);
  });
  return out;
}
const SOURCES = ['lead', 'subscriber', 'import', 'manual'];

export default async function ContactsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const { db, profile } = await requireStaff();
  const isAdmin = profile.role === 'admin';
  const q = (sp.q ?? '').trim().slice(0, 80);
  const page = Math.max(0, Number(sp.page) || 0);
  const prio = [1, 2, 3, 4].includes(Number(sp.p)) ? Number(sp.p) : 0;
  const list = sp.list?.slice(0, 60) || '';

  // Counts per list and priority (one grouped query); empty until the priority upgrade has run.
  const { data: countRows } = await db.rpc('contact_counts');
  const groups = (countRows ?? []) as { list_name: string; priority: number; total: number }[];
  const lists = [...new Map(groups.map((g) => [g.list_name, 0])).keys()].sort((a, b) => (a === 'Website' ? 1 : b === 'Website' ? -1 : a.localeCompare(b)));
  const listTotal = (l: string) => groups.filter((g) => g.list_name === l).reduce((n, g) => n + Number(g.total), 0);
  const prioTotal = (p: number) => groups.filter((g) => g.priority === p && (!list || g.list_name === list)).reduce((n, g) => n + Number(g.total), 0);
  const hasPriority = groups.length > 0;

  const cols = hasPriority
    ? 'id,email,name,company,phone,source,tags,status,replied_at,created_at,priority,trucks,list_name,details'
    : 'id,email,name,company,phone,source,tags,status,replied_at,created_at';
  let query = db.from('contacts').select(cols, { count: 'exact' });
  query = hasPriority
    ? query.order('priority').order('trucks', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false })
    : query.order('created_at', { ascending: false });
  query = query.range(page * PAGE, page * PAGE + PAGE - 1);
  if (hasPriority && list) query = query.eq('list_name', list);
  if (hasPriority && prio) query = query.eq('priority', prio);
  if (sp.source && SOURCES.includes(sp.source)) query = query.eq('source', sp.source);
  if (sp.tag) query = query.contains('tags', [sp.tag]);
  if (sp.status) query = query.eq('status', sp.status);
  if (q) {
    const like = `%${q.replace(/[%_,()]/g, ' ')}%`;
    query = query.or(`email.ilike.${like},name.ilike.${like},company.ilike.${like}`);
  }
  const [{ data: rawData, count }, counts] = await Promise.all([
    query,
    Promise.all(SOURCES.map((s) => db.from('contacts').select('id', { count: 'exact', head: true }).eq('source', s).then((r) => [s, r.count ?? 0] as const))),
  ]);
  const data = (rawData ?? []) as unknown as Row[];
  const pages = Math.max(1, Math.ceil((count ?? 0) / PAGE));
  const qs = (extra: Record<string, string | undefined>) => {
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries({ list: list || undefined, p: prio ? String(prio) : undefined, source: sp.source, tag: sp.tag, status: sp.status, q: q || undefined, ...extra })) if (v) u.set(k, v);
    const s = u.toString();
    return s ? `?${s}` : '';
  };

  return (
    <>
      <AdminTitle title="Contacts & subscribers">
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/contacts/import" className="inline-flex items-center gap-2 rounded-md bg-accent-deep px-3 py-2 text-sm font-bold text-white hover:bg-accent-hover">
            <Upload className="h-4 w-4" aria-hidden /> Upload leads
          </Link>
          <Link
            href={`/admin/emails/campaigns/new${
              list || prio
                ? `?${new URLSearchParams([...(list ? [['list', list]] : []), ...(prio ? [['p', String(prio)]] : [])])}`
                : sp.tag
                  ? `?tag=${encodeURIComponent(sp.tag)}`
                  : ''
            }`} className="inline-flex items-center gap-2 rounded-md bg-charcoal px-3 py-2 text-sm font-semibold text-white">
            <Send className="h-4 w-4" aria-hidden /> {prio ? `Email Priority ${prio}` : 'Send proposal'}
          </Link>
          <Link
            href={`/admin/automation/new${list ? `?list=${encodeURIComponent(list)}` : ''}`}
            className="inline-flex items-center gap-2 rounded-md bg-green-ink px-3 py-2 text-sm font-bold text-white hover:opacity-90"
          >
            <Bot className="h-4 w-4" aria-hidden /> Start automation
          </Link>
          <a href={`/admin/contacts/export${qs({ page: undefined })}`} className="inline-flex items-center gap-2 rounded-md border border-ink/20 bg-white px-3 py-2 text-sm font-semibold hover:border-ink">
            <Download className="h-4 w-4" aria-hidden /> Export CSV
          </a>
        </div>
      </AdminTitle>

      {hasPriority ? (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-bold uppercase tracking-wide text-muted">List</span>
            <Link href={`/admin/contacts${qs({ list: undefined, page: undefined })}`} className={cn('rounded-full px-3 py-1.5 text-sm font-semibold', !list ? 'bg-charcoal text-white' : 'bg-white')}>
              All lists <span className="opacity-70">({groups.reduce((n, g) => n + Number(g.total), 0).toLocaleString()})</span>
            </Link>
            {lists.map((l) => (
              <Link key={l} href={`/admin/contacts${qs({ list: l, page: undefined })}`} className={cn('rounded-full px-3 py-1.5 text-sm font-semibold', list === l ? 'bg-charcoal text-white' : 'bg-white')}>
                {l} <span className="opacity-70">({listTotal(l).toLocaleString()})</span>
              </Link>
            ))}
          </div>
          <nav aria-label="Priority" className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
            <Link href={`/admin/contacts${qs({ p: undefined, page: undefined })}`} className={cn('rounded-lg border px-3 py-2', !prio ? 'border-charcoal bg-charcoal text-white' : 'border-ink/10 bg-white hover:border-ink/40')}>
              <span className="block text-xs font-bold uppercase tracking-wide opacity-80">All priorities</span>
              <span className="font-display text-2xl font-bold tabular-nums">{[1, 2, 3, 4].reduce((n, p) => n + prioTotal(p), 0).toLocaleString()}</span>
            </Link>
            {PRIORITIES.map((p) => (
              <Link
                key={p.value}
                href={`/admin/contacts${qs({ p: String(p.value), page: undefined })}`}
                aria-current={prio === p.value ? 'page' : undefined}
                className={cn('rounded-lg border px-3 py-2', prio === p.value ? 'border-charcoal bg-charcoal text-white' : 'border-ink/10 bg-white hover:border-ink/40')}
              >
                <span className="block text-xs font-bold uppercase tracking-wide opacity-80">{p.label} · {p.hint}</span>
                <span className="font-display text-2xl font-bold tabular-nums">{prioTotal(p.value).toLocaleString()}</span>
              </Link>
            ))}
          </nav>
        </>
      ) : null}

      <div className="mb-4 flex flex-wrap gap-2">
        <Link href={`/admin/contacts${qs({ source: undefined, page: undefined })}`} className={cn('rounded-full px-3 py-1.5 text-sm font-semibold', !sp.source ? 'bg-charcoal text-white' : 'bg-white')}>All</Link>
        {counts.map(([s, c]) => (
          <Link key={s} href={`/admin/contacts${qs({ source: s, page: undefined })}`} className={cn('rounded-full px-3 py-1.5 text-sm font-semibold capitalize', sp.source === s ? 'bg-charcoal text-white' : 'bg-white')}>
            {s === 'subscriber' ? 'Subscribers' : s === 'lead' ? 'Form leads' : s === 'import' ? 'Uploaded' : 'Manual'} <span className="opacity-70">({c})</span>
          </Link>
        ))}
        <Link href={`/admin/contacts${qs({ tag: 'interested', source: undefined, page: undefined })}`} className={cn('rounded-full px-3 py-1.5 text-sm font-semibold', sp.tag === 'interested' ? 'bg-green-ink text-white' : 'bg-green/15 text-green-ink')}>
          ★ Interested
        </Link>
        {sp.tag && sp.tag !== 'interested' ? (
          <Link href={`/admin/contacts${qs({ tag: undefined })}`} className="rounded-full bg-accent/15 px-3 py-1.5 text-sm font-semibold text-accent-ink">tag: {sp.tag} ✕</Link>
        ) : null}
      </div>

      <form className="mb-4 flex gap-2" action="/admin/contacts">
        {sp.source ? <input type="hidden" name="source" value={sp.source} /> : null}
        {list ? <input type="hidden" name="list" value={list} /> : null}
        {prio ? <input type="hidden" name="p" value={prio} /> : null}
        <label htmlFor="cq" className="sr-only">Search contacts</label>
        <input id="cq" name="q" defaultValue={q} placeholder="Search email, name, company" className="field max-w-md !py-2" />
        <button className="rounded-md bg-charcoal px-4 text-sm font-semibold text-white">Search</button>
      </form>

      <BulkForm action={deleteContacts} noun="contact" canDelete={isAdmin}>
      <div className="overflow-x-auto rounded-xl border border-ink/10 bg-white shadow-card">
        <table className="w-full min-w-[48rem] text-left text-sm">
          <thead className="bg-offwhite text-xs uppercase tracking-wide text-muted">
            <tr>
              {isAdmin ? <th className="w-10 px-4 py-3"><span className="sr-only">Select</span></th> : null}
              {hasPriority ? <th className="px-4 py-3">Priority</th> : null}
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Company / contact</th>
              {hasPriority ? <th className="px-4 py-3 text-right">Trucks</th> : null}
              {hasPriority ? <th className="px-4 py-3">City</th> : null}
              <th className="px-4 py-3">List / source</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {data.map((c) => (
              <tr key={c.id} className="hover:bg-offwhite">
                {isAdmin ? <td className="px-4 py-3"><RowCheck value={c.id} label={c.email} show /></td> : null}
                {hasPriority ? (
                  <td className="px-4 py-3">
                    <span className={cn('whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold', PRIO_STYLE[c.priority ?? 1])}>P{c.priority ?? 1}</span>
                  </td>
                ) : null}
                <td className="px-4 py-3">
                  <Link href={`/admin/contacts/${c.id}`} className="font-semibold hover:underline">{c.email}</Link>
                  {c.phone ? <span className="block text-xs text-muted">{c.phone}</span> : null}
                </td>
                <td className="px-4 py-3">{c.company ?? c.name ?? '—'}{c.company && c.name ? <span className="block text-xs text-muted">{c.name}</span> : null}</td>
                {hasPriority ? <td className="px-4 py-3 text-right tabular-nums">{c.trucks ?? '—'}</td> : null}
                {hasPriority ? <td className="px-4 py-3">{contactCity(c.details) ?? '—'}</td> : null}
                <td className="px-4 py-3">{c.list_name ?? '—'}<span className="block text-xs capitalize text-muted">{c.source}</span></td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(c.tags as string[]).map((t) => (
                      <Link key={t} href={`/admin/contacts?tag=${encodeURIComponent(t)}`} className="rounded bg-offwhite px-1.5 py-0.5 text-xs hover:bg-accent/15">{t}</Link>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn('text-xs font-bold uppercase', c.status === 'subscribed' ? 'text-green-ink' : 'text-[#B42318]')}>{c.status}</span>
                  {c.replied_at ? <span className="block text-xs text-muted">replied</span> : null}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{new Date(c.created_at).toLocaleDateString('en-US')}</td>
              </tr>
            ))}
            {!data.length ? <tr><td colSpan={(isAdmin ? 7 : 6) + (hasPriority ? 3 : 0)} className="px-4 py-10 text-center text-muted">No contacts yet. Form leads and newsletter subscribers appear here automatically.</td></tr> : null}
          </tbody>
        </table>
      </div>
      </BulkForm>
      {count && count > PAGE ? (
        <nav aria-label="Pages" className="mt-4 flex flex-wrap items-center gap-1 text-sm">
          {page > 0 ? <Link href={`/admin/contacts${qs({ page: String(page - 1) })}`} className="rounded-md border border-ink/15 bg-white px-3 py-1.5 font-semibold hover:border-ink">← Prev</Link> : null}
          {pageList(page, pages).map((n, i) =>
            n === 'gap' ? (
              <span key={`g${i}`} className="px-1 text-muted">…</span>
            ) : (
              <Link
                key={n}
                href={`/admin/contacts${qs({ page: n ? String(n) : undefined })}`}
                aria-current={n === page ? 'page' : undefined}
                className={cn('min-w-[2.25rem] rounded-md border px-2.5 py-1.5 text-center font-semibold tabular-nums', n === page ? 'border-charcoal bg-charcoal text-white' : 'border-ink/15 bg-white hover:border-ink')}
              >
                {n + 1}
              </Link>
            ),
          )}
          {page + 1 < pages ? <Link href={`/admin/contacts${qs({ page: String(page + 1) })}`} className="rounded-md border border-ink/15 bg-white px-3 py-1.5 font-semibold hover:border-ink">Next →</Link> : null}
          <span className="ml-2 text-muted">{(page * PAGE + 1).toLocaleString()}–{Math.min(count, (page + 1) * PAGE).toLocaleString()} of {count.toLocaleString()}</span>
        </nav>
      ) : null}

      <section className="card mt-8 max-w-3xl">
        <h2 className="text-2xl">Add one contact</h2>
        <form action={saveContact} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input name="email" type="email" required placeholder="Email" aria-label="Email" className="field" />
          <input name="name" placeholder="Name" aria-label="Name" className="field" />
          <input name="company" placeholder="Company" aria-label="Company" className="field" />
          <input name="phone" placeholder="Phone" aria-label="Phone" className="field" />
          <input name="tags" placeholder="Tags, comma separated (e.g. fleet, la)" aria-label="Tags" className="field sm:col-span-2" />
          <SmallButton className="justify-self-start">Add contact</SmallButton>
        </form>
      </section>
    </>
  );
}
