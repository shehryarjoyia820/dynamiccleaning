import Link from 'next/link';
import { Download } from 'lucide-react';
import { ENGINE_LABELS, LEAD_STATUSES, requireStaff, type Lead } from '@/lib/admin';
import { cn } from '@/lib/utils';
import { AdminTitle, StatusBadge } from './ui';
import { deleteLeads } from './actions';
import { BulkForm, RowCheck } from './bulk-form';

export const metadata = { title: 'Leads' };

const PAGE = 50;

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; page?: string }> }) {
  const sp = await searchParams;
  const { db, profile } = await requireStaff();
  const isAdmin = profile.role === 'admin';
  const status = LEAD_STATUSES.includes(sp.status as never) ? sp.status : undefined;
  const q = (sp.q ?? '').trim().slice(0, 80);
  const page = Math.max(0, Number(sp.page) || 0);

  let query = db
    .from('leads')
    .select('id,created_at,kind,status,full_name,company,phone,email,trucks,location,engine_type,preferred_date,assigned_to', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(page * PAGE, page * PAGE + PAGE - 1);
  if (status) query = query.eq('status', status);
  if (q) {
    const like = `%${q.replace(/[%_,()]/g, ' ')}%`;
    query = query.or(`full_name.ilike.${like},company.ilike.${like},email.ilike.${like},phone.ilike.${like},location.ilike.${like}`);
  }
  const [{ data, count, error }, counts, team] = await Promise.all([
    query,
    Promise.all(LEAD_STATUSES.map((s) => db.from('leads').select('id', { count: 'exact', head: true }).eq('status', s).then((r) => [s, r.count ?? 0] as const))),
    db.from('profiles').select('id,full_name'),
  ]);
  const leads = (data ?? []) as Lead[];
  const names = new Map((team.data ?? []).map((p) => [p.id, p.full_name]));
  const qs = (extra: Record<string, string | undefined>) => {
    const u = new URLSearchParams();
    const merged = { status, q: q || undefined, ...extra };
    for (const [k, v] of Object.entries(merged)) if (v) u.set(k, v);
    const s = u.toString();
    return s ? `?${s}` : '';
  };

  return (
    <>
      <AdminTitle title="Leads">
        <a href={`/admin/leads/export${qs({})}`} className="inline-flex items-center gap-2 rounded-md border border-ink/20 bg-white px-3 py-2 text-sm font-semibold hover:border-ink">
          <Download className="h-4 w-4" aria-hidden /> Export CSV
        </a>
      </AdminTitle>

      <div className="mb-4 flex flex-wrap gap-2">
        <Link href={`/admin${qs({ status: undefined })}`} className={cn('rounded-full px-3 py-1.5 text-sm font-semibold', !status ? 'bg-charcoal text-white' : 'bg-white')}>
          All
        </Link>
        {counts.map(([s, c]) => (
          <Link key={s} href={`/admin${qs({ status: s })}`} className={cn('rounded-full px-3 py-1.5 text-sm font-semibold capitalize', status === s ? 'bg-charcoal text-white' : 'bg-white')}>
            {s} <span className="opacity-70">({c})</span>
          </Link>
        ))}
      </div>

      <form className="mb-4 flex gap-2" action="/admin">
        {status ? <input type="hidden" name="status" value={status} /> : null}
        <label htmlFor="q" className="sr-only">Search leads</label>
        <input id="q" name="q" defaultValue={q} placeholder="Search name, company, email, phone, location" className="field max-w-md !py-2" />
        <button className="rounded-md bg-charcoal px-4 text-sm font-semibold text-white">Search</button>
      </form>

      {error ? <p className="rounded-md bg-[#FEE4E2] p-3 text-sm">{error.message}</p> : null}

      <BulkForm action={deleteLeads} noun="lead" canDelete={isAdmin}>
      <div className="overflow-x-auto rounded-xl border border-ink/10 bg-white shadow-card">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="bg-offwhite text-xs uppercase tracking-wide text-muted">
            <tr>
              {isAdmin ? <th className="w-10 px-4 py-3"><span className="sr-only">Select</span></th> : null}
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Trucks</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Preferred</th>
              <th className="px-4 py-3">Assigned</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {leads.map((l) => (
              <tr key={l.id} className="hover:bg-offwhite">
                {isAdmin ? <td className="px-4 py-3"><RowCheck value={l.id} label={l.full_name} show /></td> : null}
                <td className="whitespace-nowrap px-4 py-3 text-muted">{new Date(l.created_at).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', dateStyle: 'medium', timeStyle: 'short' })}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${l.id}`} className="font-semibold text-ink underline-offset-4 hover:underline">
                    {l.full_name}
                  </Link>
                  <span className="block text-xs text-muted">{l.kind === 'contact' ? 'Contact message' : l.company || 'Booking'}</span>
                </td>
                <td className="px-4 py-3">
                  {l.phone ? <a href={`tel:${l.phone}`} className="block hover:underline">{l.phone}</a> : null}
                  <a href={`mailto:${l.email}`} className="block text-muted hover:underline">{l.email}</a>
                </td>
                <td className="px-4 py-3">
                  {l.trucks ?? '—'}
                  {l.engine_type ? <span className="block text-xs text-muted">{ENGINE_LABELS[l.engine_type]}</span> : null}
                </td>
                <td className="px-4 py-3">{l.location ?? '—'}</td>
                <td className="whitespace-nowrap px-4 py-3">{l.preferred_date ?? '—'}</td>
                <td className="px-4 py-3">{l.assigned_to ? names.get(l.assigned_to) ?? '—' : '—'}</td>
                <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
              </tr>
            ))}
            {leads.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 9 : 8} className="px-4 py-10 text-center text-muted">No leads found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      </BulkForm>

      {count && count > PAGE ? (
        <div className="mt-4 flex items-center gap-3 text-sm">
          {page > 0 ? <Link href={`/admin${qs({ page: String(page - 1) })}`} className="font-semibold underline">← Newer</Link> : null}
          <span className="text-muted">
            {page * PAGE + 1}–{Math.min(count, (page + 1) * PAGE)} of {count}
          </span>
          {(page + 1) * PAGE < count ? <Link href={`/admin${qs({ page: String(page + 1) })}`} className="font-semibold underline">Older →</Link> : null}
        </div>
      ) : null}
    </>
  );
}
