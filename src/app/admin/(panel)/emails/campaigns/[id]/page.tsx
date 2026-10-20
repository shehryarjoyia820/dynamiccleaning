import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { requireStaff } from '@/lib/admin';
import { resolveAudience, type Audience, type Followup } from '@/lib/campaigns';
import { mailConfigured } from '@/lib/mailer';
import { serviceClient } from '@/lib/supabase/clients';
import { cn } from '@/lib/utils';
import { cancelCampaign, deleteCampaign, launchCampaign, setCampaignPaused } from '../../../email-actions';
import { AdminTitle, CAMPAIGN_STATUS, SmallButton } from '../../../ui';
import { SendRunner } from './runner';

export const metadata = { title: 'Send' };

function audienceLabel(a: Audience) {
  if (a.type === 'tags') return `Tag: ${a.tags.join(', ')}`;
  if (a.type === 'sources') return `Source: ${a.sources.join(', ')}`;
  if (a.type === 'contacts') return `${a.ids.length} selected contact(s)`;
  return 'All subscribed contacts';
}

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { db } = await requireStaff();
  const { data: c } = await db.from('campaigns').select('*').eq('id', id).maybeSingle();
  if (!c) notFound();
  const followups = (c.followups ?? []) as Followup[];
  const templateIds = [c.template_id, ...followups.map((f) => f.template_id)];
  const { data: tpls } = await db.from('email_templates').select('id,name,subject').in('id', templateIds);
  const tname = new Map((tpls ?? []).map((t) => [t.id, t.name]));

  // Per-step stats
  const { data: sends } = await db.from('email_sends').select('step,status,opened_at').eq('campaign_id', id).limit(20000);
  const steps = [c.template_id, ...followups.map((f) => f.template_id)].map((tid, step) => {
    const rows = (sends ?? []).filter((s) => s.step === step);
    const by = (st: string) => rows.filter((r) => r.status === st).length;
    return { step, name: tname.get(tid) ?? '—', delay: step ? followups[step - 1].delay_days : 0, total: rows.length, sent: by('sent'), queued: by('queued') + by('sending'), failed: by('failed'), skipped: by('skipped') + by('cancelled'), opened: rows.filter((r) => r.opened_at).length };
  });

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
          <div className="overflow-x-auto rounded-xl border border-ink/10 bg-white shadow-card">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="bg-offwhite text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Sent</th>
                  <th className="px-4 py-3">Waiting</th>
                  <th className="px-4 py-3">Opened</th>
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
                    <td className="px-4 py-3">{s.skipped}</td>
                    <td className={cn('px-4 py-3', s.failed && 'font-bold text-[#B42318]')}>{s.failed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted">Opens are approximate: some mail apps block tracking images. Skipped = replied, unsubscribed or already booked.</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {c.status === 'sending' ? <SendRunner hasDue={steps[0].queued > 0} /> : null}
            {c.status === 'sending' ? (
              <form action={setCampaignPaused.bind(null, c.id, true)}><button className="rounded-md border border-ink/20 px-4 py-2 text-sm font-semibold">Pause</button></form>
            ) : null}
            {c.status === 'paused' ? (
              <form action={setCampaignPaused.bind(null, c.id, false)}><SmallButton>Resume</SmallButton></form>
            ) : null}
            {c.status === 'sending' || c.status === 'paused' ? (
              <form action={cancelCampaign.bind(null, c.id)}><button className="text-sm font-semibold text-[#B42318] underline underline-offset-4">Stop &amp; cancel remaining</button></form>
            ) : null}
          </div>
          {followups.length && c.status === 'sending' ? (
            <p className="mt-3 text-sm text-muted">Follow-ups go out automatically once a day when they are due. You can close this page.</p>
          ) : null}
        </>
      ) : null}
    </>
  );
}
