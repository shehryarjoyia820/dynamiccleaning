import Link from 'next/link';
import { requireStaff } from '@/lib/admin';
import { PRIORITIES } from '@/lib/campaigns';
import { cn } from '@/lib/utils';
import { createCampaign } from '../../../email-actions';
import { AdminTitle, SmallButton } from '../../../ui';

export const metadata = { title: 'New campaign' };

const SOURCES = [
  ['lead', 'Website form leads'],
  ['subscriber', 'Newsletter subscribers'],
  ['import', 'Uploaded contacts'],
  ['manual', 'Added manually'],
];

export default async function NewCampaign({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const sp = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])) as Record<string, string | undefined>;
  // Lists picked for a priority send (?list=A&list=B); toggled with the chips below.
  const picked = [raw.list ?? []].flat().filter(Boolean).slice(0, 20);
  const { db } = await requireStaff();

  // Lists and how many contacts each priority has, in total and not yet emailed.
  const [{ data: countRows }, { data: freshRows }, { data: allRows }] = await Promise.all([
    db.rpc('contact_counts'),
    db.rpc('priority_available', { p_lists: picked, p_skip_emailed: true }),
    db.rpc('priority_available', { p_lists: picked, p_skip_emailed: false }),
  ]);
  const lists = [...new Set(((countRows ?? []) as { list_name: string }[]).map((r) => r.list_name))].sort();
  const avail = (rows: unknown, p: number) => Number(((rows ?? []) as { priority: number; total: number }[]).find((r) => r.priority === p)?.total ?? 0);
  const hasPriority = lists.length > 0;
  const toggleHref = (l: string) => {
    const next = picked.includes(l) ? picked.filter((x) => x !== l) : [...picked, l];
    const u = new URLSearchParams();
    next.forEach((x) => u.append('list', x));
    return `/admin/emails/campaigns/new${u.size ? `?${u}` : ''}`;
  };
  const [{ data: templates }, { data: tagRows }] = await Promise.all([
    db.from('email_templates').select('id,name,kind').order('kind').order('name'),
    db.from('contacts').select('tags').eq('status', 'subscribed').limit(5000),
  ]);
  const tagCounts = new Map<string, number>();
  for (const r of tagRows ?? []) for (const t of r.tags as string[]) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
  const tags = Array.from(tagCounts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const proposals = (templates ?? []).filter((t) => t.kind !== 'follow_up');
  const followups = templates ?? [];

  if (!templates?.length) {
    return (
      <>
        <AdminTitle title="New send" />
        <p className="card max-w-xl">
          First create an email template. <Link href="/admin/emails/templates/new" className="font-semibold text-accent-ink underline">Create template</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <AdminTitle title="New campaign" />
      <form action={createCampaign} className="grid max-w-3xl gap-6">
        <section className="card grid gap-4">
          <div>
            <label className="label" htmlFor="name">Name (internal)</label>
            <input
              id="name"
              name="name"
              required
              className="field"
              defaultValue={picked.length ? `${picked.join(' + ')} · ${new Date().toLocaleDateString('en-US')}` : sp.tag ? `Proposal to ${sp.tag}` : `Proposal ${new Date().toLocaleDateString('en-US')}`}
            />
          </div>
          <div>
            <label className="label" htmlFor="template_id">Email to send</label>
            <select id="template_id" name="template_id" required className="field">
              {proposals.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </section>

        <fieldset className="card grid gap-3">
          <legend className="float-left mb-2 font-display text-2xl font-bold uppercase">Who receives it</legend>
          <p className="clear-left text-sm text-muted">Only subscribed contacts are included. Unsubscribed people are always skipped.</p>
          {hasPriority ? (
            <div className="rounded-lg border-2 border-accent/40 bg-accent/5 p-4">
              <label className="flex items-center gap-2 font-semibold">
                <input type="radio" name="audience" value="priority" defaultChecked={!sp.tag} className="h-4 w-4" /> By list and priority
              </label>
              <p className="mt-1 text-sm text-muted">Choose the lists, tick the priorities, and enter how many people to email from each. Biggest fleets in each priority go first.</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-muted">Lists</span>
                {lists.map((l) => (
                  <Link
                    key={l}
                    href={toggleHref(l)}
                    scroll={false}
                    aria-pressed={picked.includes(l)}
                    className={cn('rounded-full border px-3 py-1 text-sm font-semibold', picked.includes(l) ? 'border-charcoal bg-charcoal text-white' : 'border-ink/15 bg-white')}
                  >
                    {picked.includes(l) ? '✓ ' : ''}
                    {l}
                  </Link>
                ))}
                <span className="text-xs text-muted">{picked.length ? '' : '(none picked = all lists)'}</span>
              </div>
              {picked.map((l) => <input key={l} type="hidden" name="lists" value={l} />)}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[30rem] text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-muted">
                    <tr>
                      <th className="py-2 pr-3">Priority</th>
                      <th className="py-2 pr-3 text-right">Not emailed yet</th>
                      <th className="py-2 pr-3 text-right">Total</th>
                      <th className="py-2">How many to email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10">
                    {PRIORITIES.map((p) => (
                      <tr key={p.value}>
                        <td className="py-2 pr-3">
                          <label className="flex items-center gap-2 font-semibold">
                            <input type="checkbox" name={`prio_${p.value}`} className="h-4 w-4" /> {p.label}
                            <span className="font-normal text-muted">{p.hint}</span>
                          </label>
                        </td>
                        <td className="py-2 pr-3 text-right tabular-nums">{avail(freshRows, p.value).toLocaleString()}</td>
                        <td className="py-2 pr-3 text-right tabular-nums text-muted">{avail(allRows, p.value).toLocaleString()}</td>
                        <td className="py-2">
                          <input
                            type="number"
                            name={`limit_${p.value}`}
                            min={0}
                            max={50000}
                            placeholder="e.g. 100"
                            aria-label={`How many ${p.label} contacts to email`}
                            className="field !w-32 !py-1.5"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm">
                <input type="checkbox" name="skip_emailed" defaultChecked className="h-4 w-4" /> Only contacts who have not been emailed before (work through a list in batches)
              </label>
            </div>
          ) : null}
          <label className="flex items-center gap-2 font-semibold">
            <input type="radio" name="audience" value="tags" defaultChecked={!!sp.tag || (!hasPriority && tags.length > 0)} className="h-4 w-4" /> Contacts with tag
          </label>
          <div className="ml-6 flex flex-wrap gap-2">
            {tags.map(([t, n]) => (
              <label key={t} className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-offwhite px-3 py-1 text-sm">
                <input type="checkbox" name="tags" value={t} defaultChecked={sp.tag === t} /> {t} <span className="text-muted">({n})</span>
              </label>
            ))}
            {!tags.length ? <span className="text-sm text-muted">No tags yet. <Link href="/admin/contacts/import" className="underline">Upload emails</Link></span> : null}
          </div>
          <label className="mt-2 flex items-center gap-2 font-semibold">
            <input type="radio" name="audience" value="sources" defaultChecked={!sp.tag && !hasPriority && !tags.length} className="h-4 w-4" /> Contacts from
          </label>
          <div className="ml-6 flex flex-wrap gap-2">
            {SOURCES.map(([v, l]) => (
              <label key={v} className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-offwhite px-3 py-1 text-sm">
                <input type="checkbox" name="sources" value={v} /> {l}
              </label>
            ))}
          </div>
          <label className="mt-2 flex items-center gap-2 font-semibold">
            <input type="radio" name="audience" value="all" className="h-4 w-4" /> All subscribed contacts
          </label>
        </fieldset>

        <fieldset className="card grid gap-3">
          <legend className="float-left mb-2 font-display text-2xl font-bold uppercase">Automatic follow-ups</legend>
          <p className="clear-left text-sm text-muted">
            Sent only to people who have not replied, not unsubscribed, and (for website leads) not yet booked. Mark a contact as “replied” to stop their follow-ups.
          </p>
          {[3, 7, 14].map((days, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr_9rem]">
              <select name="fu_template" aria-label={`Follow-up ${i + 1} template`} className="field" defaultValue="">
                <option value="">Follow-up {i + 1}: none</option>
                {followups.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <label className="flex items-center gap-2 text-sm">
                <input name="fu_days" type="number" min={1} max={90} defaultValue={days} aria-label={`Follow-up ${i + 1} delay in days`} className="field w-20" /> days later
              </label>
            </div>
          ))}
        </fieldset>

        <div className="flex items-center gap-3">
          <SmallButton className="px-6 py-3 text-base">Review &amp; send →</SmallButton>
          <span className="text-sm text-muted">Nothing is sent until you confirm on the next screen.</span>
        </div>
      </form>
    </>
  );
}
