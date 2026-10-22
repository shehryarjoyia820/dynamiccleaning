import Link from 'next/link';
import { Eye, Pause, Play, Plus, RefreshCw, Settings2, Star } from 'lucide-react';
import { requireStaff } from '@/lib/admin';
import { fmtWindow, inWindow, laNow, type Automation } from '@/lib/automation';
import { PRIORITIES } from '@/lib/campaigns';
import { schedulerStatus } from '@/lib/scheduler';
import { cn } from '@/lib/utils';
import { repairScheduler, resumeAutomation, runAutomationNow, stopAutomation } from '../automation-actions';
import { AdminTitle } from '../ui';
import { LiveRefresh } from './live-refresh';

export const metadata = { title: 'Automation' };
export const dynamic = 'force-dynamic';

type Daily = { day: string; priority: number; picked: number; sent: number; opened: number; follow_ups: number };
type Feed = { id: string; step: number; status: string; priority: number | null; recipient_email: string | null; recipient_city?: string | null; open_count: number | null; sent_at: string | null; send_after: string; created_at: string };

const pt = (iso: string) => new Date(iso).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

function nextWindow(t: { start: string; end: string }, minutes: number) {
  if (inWindow(t, minutes)) return { now: true, label: 'Sending now' };
  const [h, m] = t.start.split(':').map(Number);
  return { now: false, label: `Next: ${h * 60 + m > minutes ? 'today' : 'tomorrow'} ${fmtWindow(t).split('–')[0]}` };
}

export default async function AutomationPage() {
  const { db } = await requireStaff();
  const { data } = await db.from('automations').select('*').order('created_at', { ascending: false });
  const autos = (data ?? []) as Automation[];
  const anyRunning = autos.some((a) => a.status === 'running');
  const sched = anyRunning ? await schedulerStatus() : null;
  const now = laNow();

  const details = await Promise.all(
    autos.map(async (a) => {
      if (!a.campaign_id) return { daily: [] as Daily[], feed: [] as Feed[], interested: new Map<number, number>(), pending: new Map<number, number>(), areaPending: new Map<number, number>(), waiting: 0 };
      const [daily, feed, openers, avail, waiting, area] = await Promise.all([
        db.rpc('campaign_daily', { p_campaign: a.campaign_id }),
        db
          .from('email_sends')
          .select('*')
          .eq('campaign_id', a.campaign_id)
          .order('sent_at', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false })
          .limit(25),
        db.from('email_sends').select('priority').eq('campaign_id', a.campaign_id).eq('step', 0).gte('open_count', 2).limit(10000),
        db.rpc('priority_available', { p_lists: a.lists, p_skip_emailed: true }),
        db.from('email_sends').select('id', { count: 'exact', head: true }).eq('campaign_id', a.campaign_id).eq('status', 'queued'),
        a.priority_cities?.length || a.priority_zips?.length
          ? db.rpc('priority_area_available', { p_lists: a.lists, p_cities: a.priority_cities ?? [], p_zips: a.priority_zips ?? [] })
          : Promise.resolve({ data: [] }),
      ]);
      const areaPending = new Map(((area.data ?? []) as { priority: number; total: number }[]).map((r) => [r.priority, Number(r.total)]));
      const interested = new Map<number, number>();
      for (const o of openers.data ?? []) interested.set(o.priority as number, (interested.get(o.priority as number) ?? 0) + 1);
      const pending = new Map(((avail.data ?? []) as { priority: number; total: number }[]).map((r) => [r.priority, Number(r.total)]));
      return { daily: (daily.data ?? []) as Daily[], feed: (feed.data ?? []) as Feed[], interested, pending, areaPending, waiting: waiting.count ?? 0 };
    }),
  );

  return (
    <>
      <AdminTitle title="Automation">
        <div className="flex flex-wrap items-center gap-3">
          {anyRunning ? <LiveRefresh seconds={30} /> : null}
          <Link href="/admin/automation/new" className="inline-flex items-center gap-2 rounded-md bg-accent-deep px-4 py-2 text-sm font-bold text-white hover:bg-accent-hover">
            <Plus className="h-4 w-4" aria-hidden /> Start automation
          </Link>
        </div>
      </AdminTitle>

      <p className="mb-5 max-w-3xl text-sm text-muted">
        Emails go out on their own from our server, every day in each priority&apos;s California time window, until you stop the automation. Your computer can be off. Anyone who
        opens a proposal more than once is marked ★ Interested and gets a follow-up after the set number of days, unless they reply (mark them “replied”) or unsubscribe.
      </p>

      {sched && !sched.active ? (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#FEF0C7] p-4 text-sm text-[#7A4A06]">
          <span>
            <strong>The background scheduler is not running</strong>
            {sched.error ? `: ${sched.error}` : '.'} Emails will only go out when this page asks for them.
          </span>
          <form action={repairScheduler}>
            <button className="rounded-md bg-[#7A4A06] px-3 py-1.5 font-semibold text-white">Start scheduler</button>
          </form>
        </div>
      ) : null}

      {!autos.length ? (
        <div className="card max-w-2xl">
          <h2 className="text-2xl">No automation yet</h2>
          <p className="mt-2 text-muted">Choose your lead lists, set each priority&apos;s time and daily number, and start. You can stop it any time.</p>
          <Link href="/admin/automation/new" className="btn-primary mt-4 !min-h-[44px]">Start automation</Link>
        </div>
      ) : null}

      <div className="grid gap-8">
        {autos.map((a, i) => {
          const d = details[i];
          const today = d.daily.filter((r) => String(r.day) === now.date);
          const sum = (p: number, k: keyof Omit<Daily, 'day' | 'priority'>, rows = d.daily) => rows.filter((r) => r.priority === p).reduce((n, r) => n + Number(r[k]), 0);
          const running = a.status === 'running';
          const byDay = [...new Set(d.daily.map((r) => String(r.day)))].slice(0, 14);
          return (
            <section key={a.id} className="rounded-xl border border-ink/10 bg-white shadow-card">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 p-5">
                <div>
                  <h2 className="text-2xl">{a.name}</h2>
                  <p className="text-sm text-muted">
                    Lists: {a.lists.length ? a.lists.join(', ') : 'All lists'} · started {pt(a.started_at)}
                    {a.last_run_at ? ` · last check ${pt(a.last_run_at)}` : ''}
                  </p>
                  {a.priority_cities?.length ? (
                    <p className="mt-1 text-sm">
                      <span className="font-semibold">Priority cities first:</span> {a.priority_cities.join(', ')}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn('rounded-full px-3 py-1 text-xs font-bold uppercase', running ? 'bg-green/15 text-green-ink' : 'bg-ink/10 text-muted')}>{running ? '● Running' : 'Stopped'}</span>
                  {running ? (
                    <form action={stopAutomation.bind(null, a.id)}>
                      <button className="inline-flex items-center gap-1.5 rounded-md border border-[#B42318]/40 px-3 py-1.5 text-sm font-semibold text-[#B42318] hover:bg-[#B42318]/5">
                        <Pause className="h-4 w-4" aria-hidden /> Stop
                      </button>
                    </form>
                  ) : (
                    <form action={resumeAutomation.bind(null, a.id)}>
                      <button className="inline-flex items-center gap-1.5 rounded-md bg-green-ink px-3 py-1.5 text-sm font-semibold text-white">
                        <Play className="h-4 w-4" aria-hidden /> Resume
                      </button>
                    </form>
                  )}
                  {running ? (
                    <form action={runAutomationNow}>
                      <button className="inline-flex items-center gap-1.5 rounded-md border border-ink/20 px-3 py-1.5 text-sm font-semibold hover:bg-offwhite" title="Run one check now (only open windows send)">
                        <RefreshCw className="h-4 w-4" aria-hidden /> Check now
                      </button>
                    </form>
                  ) : null}
                  <Link href={`/admin/automation/new?id=${a.id}`} className="inline-flex items-center gap-1.5 rounded-md border border-ink/20 px-3 py-1.5 text-sm font-semibold hover:bg-offwhite">
                    <Settings2 className="h-4 w-4" aria-hidden /> Settings
                  </Link>
                  {a.campaign_id ? (
                    <Link href={`/admin/emails/campaigns/${a.campaign_id}`} className="rounded-md border border-ink/20 px-3 py-1.5 text-sm font-semibold hover:bg-offwhite">
                      Full record
                    </Link>
                  ) : null}
                </div>
              </header>

              <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
                {PRIORITIES.map((p) => {
                  const t = a.tiers.find((x) => x.priority === p.value);
                  const on = !!t?.enabled && (t?.daily ?? 0) > 0;
                  const win = t ? nextWindow(t, now.minutes) : null;
                  const pickedToday = sum(p.value, 'picked', today);
                  return (
                    <div key={p.value} className={cn('rounded-lg border p-4', on ? 'border-ink/10' : 'border-dashed border-ink/15 opacity-60')}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-display text-lg font-bold uppercase">{p.label}</p>
                          <p className="text-xs text-muted">{p.hint}</p>
                        </div>
                        {on && win ? (
                          <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-bold', win.now && running ? 'bg-green/15 text-green-ink' : 'bg-ink/10 text-muted')}>{running ? win.label : 'Stopped'}</span>
                        ) : (
                          <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[11px] font-bold text-muted">Off</span>
                        )}
                      </div>
                      {t ? <p className="mt-2 text-sm">{fmtWindow(t)} · {t.daily}/day</p> : null}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-muted">
                          <span>Today</span>
                          <span className="tabular-nums">{pickedToday} / {t?.daily ?? 0}</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink/10">
                          <div className="h-full bg-accent-deep" style={{ width: `${Math.min(100, t?.daily ? (pickedToday / t.daily) * 100 : 0)}%` }} />
                        </div>
                      </div>
                      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                        <dt className="text-muted">Emailed</dt>
                        <dd className="text-right font-semibold tabular-nums">{sum(p.value, 'sent').toLocaleString()}</dd>
                        <dt className="text-muted">Pending</dt>
                        <dd className="text-right font-semibold tabular-nums">{(d.pending.get(p.value) ?? 0).toLocaleString()}</dd>
                        {a.priority_cities?.length ? (
                          <>
                            <dt className="text-muted">↳ in priority cities</dt>
                            <dd className="text-right font-semibold tabular-nums text-accent-ink">{(d.areaPending.get(p.value) ?? 0).toLocaleString()}</dd>
                          </>
                        ) : null}
                        <dt className="text-muted">Opened</dt>
                        <dd className="text-right font-semibold tabular-nums text-green-ink">{sum(p.value, 'opened').toLocaleString()}</dd>
                        <dt className="text-muted">★ Interested</dt>
                        <dd className="text-right font-semibold tabular-nums">{(d.interested.get(p.value) ?? 0).toLocaleString()}</dd>
                        <dt className="text-muted">Follow-ups</dt>
                        <dd className="text-right font-semibold tabular-nums">{sum(p.value, 'follow_ups').toLocaleString()}</dd>
                      </dl>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-6 border-t border-ink/10 p-5 xl:grid-cols-2">
                <div>
                  <h3 className="font-display text-xl font-bold uppercase">Live feed</h3>
                  <p className="text-xs text-muted">{d.waiting.toLocaleString()} email(s) queued (including scheduled follow-ups)</p>
                  <ul className="mt-3 divide-y divide-ink/10 text-sm">
                    {d.feed.map((f) => (
                      <li key={f.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                        <span className="min-w-0">
                          <span className="mr-2 rounded bg-ink/10 px-1.5 py-0.5 text-[11px] font-bold">P{f.priority ?? '–'}</span>
                          <span className="font-semibold">{f.recipient_email ?? '(deleted contact)'}</span>
                          {f.recipient_city ? (
                            <span className={cn('ml-2 text-xs', a.priority_cities?.some((c) => c.toLowerCase() === f.recipient_city!.toLowerCase()) ? 'font-semibold text-accent-ink' : 'text-muted')}>
                              {f.recipient_city}
                            </span>
                          ) : null}
                          <span className="ml-2 text-xs text-muted">{f.step ? 'Follow-up' : 'Proposal'}</span>
                        </span>
                        <span className="flex items-center gap-3 text-xs">
                          {f.open_count ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-green-ink">
                              <Eye className="h-3.5 w-3.5" aria-hidden /> {f.open_count}×{f.open_count >= 2 ? <Star className="h-3.5 w-3.5 fill-current" aria-label="Interested" /> : null}
                            </span>
                          ) : null}
                          <span className={cn('font-bold uppercase', f.status === 'sent' ? 'text-green-ink' : f.status === 'failed' ? 'text-[#B42318]' : 'text-muted')}>
                            {f.status === 'queued' ? `Scheduled ${pt(f.send_after)}` : f.status}
                          </span>
                          {f.sent_at ? <span className="text-muted">{pt(f.sent_at)}</span> : null}
                        </span>
                      </li>
                    ))}
                    {!d.feed.length ? <li className="py-4 text-muted">Nothing sent yet. The first emails go out in the next open window.</li> : null}
                  </ul>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold uppercase">By day</h3>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full min-w-[26rem] text-left text-sm">
                      <thead className="text-xs uppercase tracking-wide text-muted">
                        <tr>
                          <th className="py-2 pr-3">Date</th>
                          {PRIORITIES.map((p) => <th key={p.value} className="py-2 pr-3 text-right">P{p.value}</th>)}
                          <th className="py-2 pr-3 text-right">Opened</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ink/10">
                        {byDay.map((day) => {
                          const rows = d.daily.filter((r) => String(r.day) === day);
                          return (
                            <tr key={day}>
                              <td className="py-2 pr-3 font-semibold">{new Date(`${day}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                              {PRIORITIES.map((p) => (
                                <td key={p.value} className="py-2 pr-3 text-right tabular-nums">{sum(p.value, 'sent', rows) || '—'}</td>
                              ))}
                              <td className="py-2 pr-3 text-right tabular-nums text-green-ink">{rows.reduce((n, r) => n + Number(r.opened), 0) || '—'}</td>
                            </tr>
                          );
                        })}
                        {!byDay.length ? (
                          <tr>
                            <td colSpan={6} className="py-4 text-muted">Daily totals appear here once emails go out.</td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
