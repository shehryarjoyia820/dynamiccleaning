import Link from 'next/link';
import { Download, Send, Upload } from 'lucide-react';
import { requireStaff } from '@/lib/admin';
import { cn } from '@/lib/utils';
import { deleteContacts, saveContact } from '../email-actions';
import { BulkForm, RowCheck } from '../bulk-form';
import { AdminTitle, SmallButton } from '../ui';

export const metadata = { title: 'Contacts' };

const PAGE = 50;
const SOURCES = ['lead', 'subscriber', 'import', 'manual'];

export default async function ContactsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const { db, profile } = await requireStaff();
  const isAdmin = profile.role === 'admin';
  const q = (sp.q ?? '').trim().slice(0, 80);
  const page = Math.max(0, Number(sp.page) || 0);

  let query = db.from('contacts').select('id,email,name,company,source,tags,status,replied_at,created_at', { count: 'exact' }).order('created_at', { ascending: false }).range(page * PAGE, page * PAGE + PAGE - 1);
  if (sp.source && SOURCES.includes(sp.source)) query = query.eq('source', sp.source);
  if (sp.tag) query = query.contains('tags', [sp.tag]);
  if (sp.status) query = query.eq('status', sp.status);
  if (q) {
    const like = `%${q.replace(/[%_,()]/g, ' ')}%`;
    query = query.or(`email.ilike.${like},name.ilike.${like},company.ilike.${like}`);
  }
  const [{ data, count }, counts] = await Promise.all([
    query,
    Promise.all(SOURCES.map((s) => db.from('contacts').select('id', { count: 'exact', head: true }).eq('source', s).then((r) => [s, r.count ?? 0] as const))),
  ]);
  const qs = (extra: Record<string, string | undefined>) => {
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries({ source: sp.source, tag: sp.tag, status: sp.status, q: q || undefined, ...extra })) if (v) u.set(k, v);
    const s = u.toString();
    return s ? `?${s}` : '';
  };

  return (
    <>
      <AdminTitle title="Contacts & subscribers">
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/contacts/import" className="inline-flex items-center gap-2 rounded-md bg-accent-deep px-3 py-2 text-sm font-bold text-white hover:bg-accent-hover">
            <Upload className="h-4 w-4" aria-hidden /> Upload emails
          </Link>
          <Link href={`/admin/emails/campaigns/new${sp.tag ? `?tag=${encodeURIComponent(sp.tag)}` : ''}`} className="inline-flex items-center gap-2 rounded-md bg-charcoal px-3 py-2 text-sm font-semibold text-white">
            <Send className="h-4 w-4" aria-hidden /> Send proposal
          </Link>
          <a href={`/admin/contacts/export${qs({ page: undefined })}`} className="inline-flex items-center gap-2 rounded-md border border-ink/20 bg-white px-3 py-2 text-sm font-semibold hover:border-ink">
            <Download className="h-4 w-4" aria-hidden /> Export CSV
          </a>
        </div>
      </AdminTitle>

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
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name / company</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {(data ?? []).map((c) => (
              <tr key={c.id} className="hover:bg-offwhite">
                {isAdmin ? <td className="px-4 py-3"><RowCheck value={c.id} label={c.email} show /></td> : null}
                <td className="px-4 py-3"><Link href={`/admin/contacts/${c.id}`} className="font-semibold hover:underline">{c.email}</Link></td>
                <td className="px-4 py-3">{c.name ?? '—'}{c.company ? <span className="block text-xs text-muted">{c.company}</span> : null}</td>
                <td className="px-4 py-3 capitalize">{c.source}</td>
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
            {!data?.length ? <tr><td colSpan={isAdmin ? 7 : 6} className="px-4 py-10 text-center text-muted">No contacts yet. Form leads and newsletter subscribers appear here automatically.</td></tr> : null}
          </tbody>
        </table>
      </div>
      </BulkForm>
      {count && count > PAGE ? (
        <div className="mt-4 flex items-center gap-3 text-sm">
          {page > 0 ? <Link href={`/admin/contacts${qs({ page: String(page - 1) })}`} className="font-semibold underline">← Newer</Link> : null}
          <span className="text-muted">{page * PAGE + 1}–{Math.min(count, (page + 1) * PAGE)} of {count}</span>
          {(page + 1) * PAGE < count ? <Link href={`/admin/contacts${qs({ page: String(page + 1) })}`} className="font-semibold underline">Older →</Link> : null}
        </div>
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
