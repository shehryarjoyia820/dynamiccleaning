import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Eye, Star } from 'lucide-react';
import { requireStaff } from '@/lib/admin';
import { INTERESTED_TAG, resolveAudience, type Audience, type Followup } from '@/lib/campaigns';
import { mailConfigured } from '@/lib/mailer';
import { serviceClient } from '@/lib/supabase/clients';
import { cn } from '@/lib/utils';
import { cancelCampaign, deleteCampaign, launchCampaign, setCampaignPaused, setInterested } from '../../../email-actions';
import { AdminTitle, CAMPAIGN_STATUS, SmallButton } from '../../../ui';
import { SendRunner } from './runner';

export const metadata = { title: 'Send' };

function audienceLabel(a: Audience) {
  if (a.type === 'tags') return `Tag: ${a.tags.join(', ')}`;
  if (a.type === 'sources') return `Source: ${a.sources.join(', ')}`;
  if (a.type === 'contacts') return `${a.ids.length} selected contact(s)`;
  return 'All subscribed contacts';
}

const SEND_STATUS: Record<string, { label: string; cls: string }> = {
  queued: { label: 'Waiting', cls: 'bg-ink/10 text-muted' },
  sending: { label: 'Sending', cls: 'bg-accent/15 text-accent-ink' },
  sent: { label: 'Sent', cls: 'bg-green/15 text-green-ink' },
  failed: { label: 'Failed', cls: 'bg-[#FEE4E2] text-[#912018]' },
  skipped: { label: 'Skipped', cls: 'bg-[#FEF0C7] text-[#7A4A06]' },
  cancelled: { label: 'Cancelled', cls: 'bg-ink/10 text-muted' },
};

const FILTERS = [
  ['all', 'All'],
  ['sent', 'Sent'],
  ['opened', 'Opened'],
  ['waiting', 'Waiting'],
  ['failed', 'Failed'],
  ['skipped', 'Skipped'],
] as const;

type SendRow = {
  id: string;
  step: number;
  status: string;
  sent_at: string | null;
  opened_at: string | null;
  open_count: number | null;
  error: string | null;
  send_after: string;
  contacts: { id: string; email: string; name: string | null; company: string | null; tags: string[] } | null;
};

const fmt = (iso: string) => new Date(iso).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

export default async function CampaignPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { id } = await params;
  const sp = await searchParams;
  const { db } = await requireStaff();
  const { data: c } = await db.from('campaigns').select('*').eq('id', id).maybeSingle();
  if (!c) notFound();
  const followups = (c.followups ?? []) as Followup[];
  const templateIds = [c.template_id, ...followups.map((f) => f.template_id)];
  const { data: tpls } = await db.from('email_templates').select('id,name,subject').in('id', templateIds);
  const tname = new Map((tpls ?? []).map((t) => [t.id, t.name]));

  const { data: sendData } = await db
    .from('email_sends')
    .select('id,step,status,sent_at,opened_at,open_count,error,send_after,contacts(id,email,name,company,tags)')
    .eq('campaign_id', id)
    .order('sent_at', { ascending: false, nullsFirst: false })
    .limit(5000);
  const sends = (sendData ?? []) as unknown as SendRow[];

  const steps = templateIds.map((tid, step) => {
    const rows = sends.filter((s) => s.step === step);
    const by = (st: string) => rows.filter((r) => r.status === st).length;
    return {
      step,
      name: tname.get(tid) ?? '—',
      delay: step ? followups[step - 1].delay_days : 0,
      total: rows.length,
      sent: by('sent'),
      queued: by('queued') + by('sending'),
      failed: by('failed'),
      skipped: by('skipped') + by('cancelled'),
      opened: rows.filter((r) => r.opened_at).length,
      opens: rows.reduce((n, r) => n + (r.open_count ?? 0), 0),
    };
  });

  // Recipient list: one step at a time, filterable.
  const step = Math.min(Math.max(0, Number(sp.step) || 0), templateIds.length - 1);
  const show = FILTERS.some(([k]) => k === sp.show) ? sp.show! : 'all';
  const stepRows = sends.filter((s) => s.step === step);
  const rows = stepRows.filter((s) =>
    show === 'all'
      ? true
      : show === 'opened'
        ? Boolean(s.opened_at)
        : show === 'waiting'
          ? s.status === 'queued' || s.status === 'sending'
          : show === 'skipped'
            ? s.status === 'skipped' || s.status === 'cancelled'
            : s.status === show,
  );
  const qs = (extra: Record<string, string | number>) => {
    const u = new URLSearchParams({ step: String(step), show, ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, String(v)])) });
    return `?${u}`;
  };

  let preview: number | null = null;
  if (c.status === 'draft') {
    const svc = serviceClient();
    preview = svc ? (await resolveAudience(svc, c.audience as Audience)).length : null;
  }

  return (
    <>
      <Link href="/admin/emails/campaigns" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All sends
      </Link>
      <AdminTitle title={c.name}>
        <span className={cn('rounded-full px-3 py-1 text-xs font-bold uppercase', CAMPAIGN_STATUS[c.status])}>{c.status}</span>
      </AdminTitle>
      <p className="mb-6 text-muted">{audienceLabel(c.audience as Audience)}</p>

      {c.status === 'draft' ? (
        <section className="card mb-6 max-w-3xl">
          <h2 className="text-2xl">Ready to send</h2>
          <ul className="mt-3 list-disc pl-5 text-sm">
            <li><strong>{tname.get(c.template_id)}</strong> to <strong>{preview ?? '?'}</strong> subscribed contact(s), now.</li>
            {followups.map((f, i) => (
              <li key={i}>Follow-up {i + 1}: <strong>{tname.get(f.template_id)}</strong>, {f.delay_days} day(s) after the first email.</li>
            ))}
          </ul>
          {!mailConfigured() ? (
            <p className="mt-4 rounded-md bg-[#FEF0C7] p-3 text-sm text-[#7A4A06]">Email is not configured yet. Add the SMTP settings in Vercel, then come back to send.</p>
          ) : null}
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <form action={launchCampaign.bind(null, c.id)}>
              <SmallButton className="px-6 py-3 text-base" disabled={!mailConfigured() || !preview}>Send now to {preview ?? 0} contact(s)</SmallButton>
            </form>
            <form action={deleteCampaign.bind(null, c.id)}>
              <button className="text-sm font-semibold text-[#B42318] underline underline-offset-4">Discard</button>
            </form>
          </div>
        </section>
      ) : null}

      {c.status !== 'draft' ? (
        <>
          {c.status === 'sending' ? <SendRunner hasDue={steps[0].queued > 0} /> : null}

          <div className="overflow-x-auto rounded-xl border border-ink/10 bg-white shadow-card">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="bg-offwhite text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Sent</th>
                  <th className="px-4 py-3">Waiting</th>
                  <th className="px-4 py-3">Opened</th>
                  <th className="px-4 py-3">Total opens</th>
                  <th className="px-4 py-3">Skipped</th>
                  <th className="px-4 py-3">Failed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {steps.map((s) => (
                  <tr key={s.step}>
                    <td className="px-4 py-3 font-semibold">{s.name}</td>
                    <td className="px-4 py-3 text-muted">{s.step === 0 ? 'First email' : `+${s.delay} days`}</td>
                    <td className="px-4 py-3">{s.sent} / {s.total}</td>
                    <td className="px-4 py-3">{s.queued}</td>
                    <td className="px-4 py-3">{s.opened}{s.sent ? ` (${Math.round((s.opened / s.sent) * 100)}%)` : ''}</td>
                    <td className="px-4 py-3">{s.opens}</td>
                    <td className="px-4 py-3">{s.skipped}</td>
                    <td className={cn('px-4 py-3', s.failed && 'font-bold text-[#B42318]')}>{s.failed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted">Opens are approximate: some mail apps block tracking images. Skipped = replied, unsubscribed or already booked.</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {c.status === 'sending' ? (
              <form action={setCampaignPaused.bind(null, c.id, true)}><button className="rounded-md border border-ink/20 px-4 py-2 text-sm font-semibold">Pause</button></form>
            ) : null}
            {c.status === 'paused' ? (
              <form action={setCampaignPaused.bind(null, c.id, false)}><SmallButton>Resume</SmallButton></form>
            ) : null}
            {c.status === 'sending' || c.status === 'paused' ? (
              <form action={cancelCampaign.bind(null, c.id)}><button className="text-sm font-semibold text-[#B42318] underline underline-offset-4">Stop &amp; cancel remaining</button></form>
            ) : null}
            <Link
              href={`/admin/emails/campaigns/new?tag=${INTERESTED_TAG}`}
              className="ml-auto inline-flex items-center gap-2 rounded-md bg-green-ink px-4 py-2 text-sm font-bold text-white hover:bg-green"
            >
              <Star className="h-4 w-4" aria-hidden /> Send a proposal to Interested contacts
            </Link>
          </div>
          {followups.length && c.status === 'sending' ? (
            <p className="mt-3 text-sm text-muted">Follow-ups go out automatically once a day when they are due. You can close this page.</p>
          ) : null}

          {/* Who received it */}
          <section className="mt-10">
            <h2 className="text-3xl">Recipients</h2>
            <p className="mt-1 text-sm text-muted">Everyone this email was sent to, how many times they opened it, and a one-click Interested flag.</p>

            {templateIds.length > 1 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {steps.map((s) => (
                  <Link key={s.step} href={qs({ step: s.step })} className={cn('rounded-md px-3 py-1.5 text-sm font-semibold', s.step === step ? 'bg-charcoal text-white' : 'bg-white')}>
                    {s.step === 0 ? 'First email' : `Follow-up ${s.step}`}
                  </Link>
                ))}
              </div>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {FILTERS.map(([k, label]) => {
                const n =
                  k === 'all'
                    ? stepRows.length
                    : k === 'opened'
                      ? stepRows.filter((r) => r.opened_at).length
                      : k === 'waiting'
                        ? stepRows.filter((r) => r.status === 'queued' || r.status === 'sending').length
                        : k === 'skipped'
                          ? stepRows.filter((r) => r.status === 'skipped' || r.status === 'cancelled').length
                          : stepRows.filter((r) => r.status === k).length;
                return (
                  <Link key={k} href={qs({ show: k })} className={cn('rounded-full px-3 py-1.5 text-sm font-semibold', show === k ? 'bg-charcoal text-white' : 'bg-white')}>
                    {label} <span className="opacity-70">({n})</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 overflow-x-auto rounded-xl border border-ink/10 bg-white shadow-card">
              <table className="w-full min-w-[52rem] text-left text-sm">
                <thead className="bg-offwhite text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-3">Recipient</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Sent</th>
                    <th className="px-4 py-3">Opens</th>
                    <th className="px-4 py-3">First opened</th>
                    <th className="px-4 py-3 text-right">Interested</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {rows.map((r) => {
                    const ct = r.contacts;
                    const st = SEND_STATUS[r.status] ?? SEND_STATUS.queued;
                    const interested = ct?.tags?.includes(INTERESTED_TAG);
                    return (
                      <tr key={r.id} className="hover:bg-offwhite">
                        <td className="px-4 py-3">
                          {ct ? (
                            <Link href={`/admin/contacts/${ct.id}`} className="font-semibold hover:underline">{ct.email}</Link>
                          ) : (
                            <span className="text-muted">(deleted contact)</span>
                          )}
                          {ct?.name || ct?.company ? <span className="block text-xs text-muted">{[ct.name, ct.company].filter(Boolean).join(' · ')}</span> : null}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn('inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase', st.cls)}>{st.label}</span>
                          {r.error && r.status !== 'sent' ? <span className="mt-0.5 block max-w-[16rem] truncate text-xs text-muted" title={r.error}>{r.error}</span> : null}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted">{r.sent_at ? fmt(r.sent_at) : r.status === 'queued' ? `Due ${fmt(r.send_after)}` : '—'}</td>
                        <td className="px-4 py-3">
                          {r.open_count ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-green-ink">
                              <Eye className="h-4 w-4" aria-hidden /> {r.open_count}×
                            </span>
                          ) : (
                            <span className="text-muted">0</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted">{r.opened_at ? fmt(r.opened_at) : '—'}</td>
                        <td className="px-4 py-3 text-right">
                          {ct ? (
                            <form action={setInterested.bind(null, ct.id, !interested)}>
                              <button
                                className={cn(
                                  'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-bold',
                                  interested ? 'bg-green/15 text-green-ink hover:bg-green/25' : 'border border-ink/20 text-ink hover:bg-offwhite',
                                )}
                                aria-pressed={interested}
                              >
                                <Star className={cn('h-3.5 w-3.5', interested && 'fill-current')} aria-hidden />
                                {interested ? 'Interested' : 'Mark interested'}
                              </button>
                            </form>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                  {!rows.length ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted">No recipients in this view.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </>
  );
}
