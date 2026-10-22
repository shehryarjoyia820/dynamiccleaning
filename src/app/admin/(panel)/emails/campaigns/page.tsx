import Link from 'next/link';
import { Bot, ChevronRight, Eye, Search, Send } from 'lucide-react';
import { requireStaff } from '@/lib/admin';
import { cn } from '@/lib/utils';
import { AdminTitle, CAMPAIGN_STATUS } from '../../ui';

export const metadata = { title: 'Campaigns' };

type Stats = {
  campaign_id: string;
  recipients: number;
  sent: number;
  waiting: number;
  failed: number;
  opened: number;
  total_opens: number;
  last_sent_at: string | null;
};

const pct = (n: number, d: number) => (d ? `${Math.round((n / d) * 100)}%` : '—');
const day = (iso: string) => new Date(iso).toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles', month: 'short', day: 'numeric', year: 'numeric' });

export default async function CampaignsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const q = (sp.q ?? '').trim();
  const status = sp.status ?? 'all';
  const { db } = await requireStaff();

  let query = db.from('campaigns').select('id,name,status,created_at,started_at,email_templates(name)').order('created_at', { ascending: false }).limit(500);
  if (q) query = query.ilike('name', `%${q.replace(/[%_]/g, '')}%`);
  if (status !== 'all') query = query.eq('status', status);
  const { data } = await query;
  const campaigns = data ?? [];

  // Totals per campaign come from a database view; empty until the history upgrade has run.
  const { data: statRows } = campaigns.length
    ? await db.from('campaign_stats').select('*').in('campaign_id', campaigns.map((c) => c.id))
    : { data: [] };
  const stats = new Map(((statRows ?? []) as Stats[]).map((s) => [s.campaign_id, s]));

  const all = [...stats.values()];
  const sum = (k: keyof Omit<Stats, 'campaign_id' | 'last_sent_at'>) => all.reduce((n, s) => n + Number(s[k] ?? 0), 0);
  const totals = { campaigns: campaigns.length, recipients: sum('recipients'), sent: sum('sent'), opened: sum('opened'), opens: sum('total_opens') };

  return (
    <>
      <AdminTitle title="Campaigns">
        <div className="flex flex-wrap gap-2">
        <Link href="/admin/automation/new" className="inline-flex items-center gap-2 rounded-md bg-green-ink px-4 py-2 text-sm font-bold text-white hover:opacity-90">
          <Bot className="h-4 w-4" aria-hidden /> Start automation
        </Link>
        <Link href="/admin/emails/campaigns/new" className="inline-flex items-center gap-2 rounded-md bg-accent-deep px-4 py-2 text-sm font-bold text-white hover:bg-accent-hover">
          <Send className="h-4 w-4" aria-hidden /> New campaign
        </Link>
        </div>
      </AdminTitle>

      <ol className="mb-6 grid max-w-4xl gap-3 text-sm sm:grid-cols-3">
        {[
          ['1. Upload emails', '/admin/contacts/import', 'CSV or paste a list, give it a tag.'],
          ['2. Write the proposal', '/admin/emails/templates', 'Plus follow-up emails, with a PDF if you like.'],
          ['3. Send', '/admin/emails/campaigns/new', 'Pick the group, add follow-ups, click send.'],
        ].map(([t, href, d]) => (
          <li key={t}>
            <Link href={href} className="card block !p-4 hover:border-accent-ink">
              <span className="font-display text-lg font-bold uppercase">{t}</span>
              <span className="block text-muted">{d}</span>
            </Link>
          </li>
        ))}
      </ol>

      <dl className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          ['Campaigns', totals.campaigns],
          ['Recipients', totals.recipients],
          ['Emails sent', totals.sent],
          ['People who opened', totals.opened],
          ['Total opens', totals.opens],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-ink/10 bg-white p-4 shadow-card">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
            <dd className="mt-1 font-display text-3xl font-bold tabular-nums">{Number(value).toLocaleString()}</dd>
          </div>
        ))}
      </dl>

      <form className="mb-4 flex flex-wrap items-center gap-2" role="search">
        <label className="relative">
          <span className="sr-only">Search campaigns</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input name="q" defaultValue={q} placeholder="Search by name" className="field !w-64 !py-2 pl-9" />
        </label>
        <select name="status" defaultValue={status} aria-label="Status" className="field !w-auto !py-2">
          <option value="all">All statuses</option>
          <option value="sending">Sending</option>
          <option value="paused">Paused</option>
          <option value="sent">Sent</option>
          <option value="draft">Draft</option>
        </select>
        <button className="rounded-md border border-ink/20 px-4 py-2 text-sm font-semibold hover:bg-offwhite">Filter</button>
        {q || status !== 'all' ? <Link href="/admin/emails/campaigns" className="text-sm font-semibold underline">Clear</Link> : null}
      </form>

      <div className="overflow-x-auto rounded-xl border border-ink/10 bg-white shadow-card">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="bg-offwhite text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Campaign</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Recipients</th>
              <th className="px-4 py-3 text-right">Sent</th>
              <th className="px-4 py-3 text-right">Waiting</th>
              <th className="px-4 py-3 text-right">Failed</th>
              <th className="px-4 py-3 text-right">Opened</th>
              <th className="px-4 py-3 text-right">Total opens</th>
              <th className="px-4 py-3">Last sent</th>
              <th className="px-4 py-3"><span className="sr-only">Open</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {campaigns.map((c) => {
              const s = stats.get(c.id);
              const href = `/admin/emails/campaigns/${c.id}`;
              return (
                <tr key={c.id} className="hover:bg-offwhite">
                  <td className="px-4 py-3">
                    <Link href={href} className="font-semibold hover:underline">{c.name}</Link>
                    <span className="block text-xs text-muted">
                      {(c.email_templates as unknown as { name: string } | null)?.name ?? '—'} · started {day(c.started_at ?? c.created_at)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold uppercase', CAMPAIGN_STATUS[c.status] ?? 'bg-ink/10 text-muted')}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{s?.recipients ?? 0}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{s?.sent ?? 0}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted">{s?.waiting ?? 0}</td>
                  <td className={cn('px-4 py-3 text-right tabular-nums', s?.failed ? 'font-semibold text-[#B42318]' : 'text-muted')}>{s?.failed ?? 0}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span className="font-semibold text-green-ink">{s?.opened ?? 0}</span>
                    <span className="ml-1 text-xs text-muted">{pct(s?.opened ?? 0, s?.recipients ?? 0)}</span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5 text-muted" aria-hidden />{s?.total_opens ?? 0}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted">{s?.last_sent_at ? day(s.last_sent_at) : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={href} className="inline-flex items-center gap-0.5 font-semibold text-accent-ink hover:underline">
                      Details <ChevronRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </td>
                </tr>
              );
            })}
            {!campaigns.length ? (
              <tr>
                <td colSpan={10} className="px-5 py-8 text-center text-muted">{q || status !== 'all' ? 'No campaigns match.' : 'No campaigns yet.'}</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-muted">Every campaign and its recipient list is kept, even if a contact is deleted later. Open a campaign for who got each email and how many times they opened it.</p>
    </>
  );
}
