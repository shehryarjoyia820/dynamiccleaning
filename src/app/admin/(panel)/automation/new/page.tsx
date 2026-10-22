import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Play } from 'lucide-react';
import { requireStaff } from '@/lib/admin';
import { DEFAULT_TIERS, type Automation } from '@/lib/automation';
import { PRIORITIES } from '@/lib/campaigns';
import { saveAutomation } from '../../automation-actions';
import { AdminTitle } from '../../ui';

export const metadata = { title: 'Start automation' };

export default async function NewAutomation({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const { db } = await requireStaff();

  let existing: Automation | null = null;
  if (sp.id) {
    const { data } = await db.from('automations').select('*').eq('id', sp.id).maybeSingle();
    if (!data) notFound();
    existing = data as Automation;
  }

  const [{ data: templates }, { data: countRows }, { data: fresh }] = await Promise.all([
    db.from('email_templates').select('id,name,kind').order('name'),
    db.rpc('contact_counts'),
    db.rpc('priority_available', { p_lists: [], p_skip_emailed: true }),
  ]);
  const groups = (countRows ?? []) as { list_name: string; priority: number; total: number }[];
  const lists = [...new Set(groups.map((g) => g.list_name))].sort();
  const listTotal = (l: string) => groups.filter((g) => g.list_name === l).reduce((n, g) => n + Number(g.total), 0);
  const notEmailed = (p: number) => Number(((fresh ?? []) as { priority: number; total: number }[]).find((r) => r.priority === p)?.total ?? 0);
  const proposals = (templates ?? []).filter((t) => t.kind !== 'follow_up');
  const followUps = templates ?? [];
  const has = (id: string | null) => !!id && (templates ?? []).some((t) => t.id === id);

  const tiers = existing?.tiers ?? DEFAULT_TIERS;
  const pickedLists = existing ? existing.lists : sp.list ? [sp.list] : lists.filter((l) => l !== 'Website');

  return (
    <>
      <Link href="/admin/automation" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Automation
      </Link>
      <AdminTitle title={existing ? 'Automation settings' : 'Start automation'} />

      {!templates?.length ? (
        <p className="card max-w-xl">
          Create an email template first. <Link href="/admin/emails/templates/new" className="font-semibold text-accent-ink underline">New template</Link>
        </p>
      ) : (
        <form action={saveAutomation} className="grid max-w-5xl gap-6">
          {existing ? <input type="hidden" name="id" value={existing.id} /> : null}

          <section className="card grid gap-4">
            <div>
              <label className="label" htmlFor="name">Name</label>
              <input id="name" name="name" defaultValue={existing?.name ?? ''} placeholder="e.g. Southern Leads daily outreach" className="field max-w-md" />
            </div>
            <fieldset>
              <legend className="label">Which leads?</legend>
              <div className="flex flex-wrap gap-2">
                {lists.map((l) => (
                  <label key={l} className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-offwhite px-3 py-1.5 text-sm font-semibold">
                    <input type="checkbox" name="lists" value={l} defaultChecked={pickedLists.includes(l)} className="h-4 w-4" /> {l}
                    <span className="font-normal text-muted">({listTotal(l).toLocaleString()})</span>
                  </label>
                ))}
                {!lists.length ? <span className="text-sm text-muted">No lists yet. <Link href="/admin/contacts/import" className="underline">Upload leads</Link> first.</span> : null}
              </div>
              <p className="mt-1 text-sm text-muted">Nothing ticked = all lists. Each contact gets the proposal once; anyone emailed before is skipped.</p>
            </fieldset>
          </section>

          <section className="card">
            <h2 className="text-2xl">Daily plan (California time)</h2>
            <p className="mt-1 text-sm text-muted">Each day, emails for a priority go out spread across its time window, biggest fleets first.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[56rem] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="py-2 pr-3">Priority</th>
                    <th className="py-2 pr-3">From</th>
                    <th className="py-2 pr-3">To</th>
                    <th className="py-2 pr-3">Emails / day</th>
                    <th className="py-2 pr-3">Proposal</th>
                    <th className="py-2 pr-3">Follow-up for repeat openers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10 align-top">
                  {PRIORITIES.map((p) => {
                    const t = tiers.find((x) => x.priority === p.value) ?? DEFAULT_TIERS[p.value - 1];
                    return (
                      <tr key={p.value}>
                        <td className="py-3 pr-3">
                          <label className="flex items-center gap-2 font-semibold">
                            <input type="checkbox" name={`enabled_${p.value}`} defaultChecked={t.enabled} className="h-4 w-4" /> {p.label}
                          </label>
                          <span className="ml-6 block text-xs text-muted">{p.hint} · {notEmailed(p.value).toLocaleString()} not emailed</span>
                        </td>
                        <td className="py-3 pr-3">
                          <input type="time" name={`start_${p.value}`} defaultValue={t.start} aria-label={`${p.label} start`} className="field !w-32 !py-1.5" />
                        </td>
                        <td className="py-3 pr-3">
                          <input type="time" name={`end_${p.value}`} defaultValue={t.end} aria-label={`${p.label} end`} className="field !w-32 !py-1.5" />
                        </td>
                        <td className="py-3 pr-3">
                          <input type="number" name={`daily_${p.value}`} min={0} max={500} defaultValue={t.daily} aria-label={`${p.label} emails per day`} className="field !w-24 !py-1.5" />
                        </td>
                        <td className="py-3 pr-3">
                          <select name={`proposal_${p.value}`} defaultValue={has(t.proposal) ? t.proposal : proposals[0]?.id} aria-label={`${p.label} proposal`} className="field !py-1.5">
                            {proposals.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                          </select>
                        </td>
                        <td className="py-3 pr-3">
                          <select name={`follow_up_${p.value}`} defaultValue={has(t.follow_up) ? t.follow_up! : ''} aria-label={`${p.label} follow-up`} className="field !py-1.5">
                            <option value="">No follow-up</option>
                            {followUps.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <label className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              Anyone who opens the proposal <strong>more than once</strong> becomes ★ Interested and gets the follow-up
              <input type="number" name="follow_up_days" min={1} max={30} defaultValue={tiers[0]?.follow_up_days ?? 3} aria-label="Days before follow-up" className="field !w-20 !py-1" />
              days later, in their priority&apos;s time window, unless they reply or unsubscribe.
            </label>
          </section>

          <div className="flex flex-wrap items-center gap-3">
            <button className="btn-primary !min-h-[48px]">
              <Play className="h-5 w-5" aria-hidden /> {existing ? 'Save settings' : 'Start automation'}
            </button>
            <span className="text-sm text-muted">Runs on our server every day until you press Stop. Max 400 emails per day across everything (Gmail safety limit).</span>
          </div>
        </form>
      )}
    </>
  );
}
