import Link from 'next/link';
import { requireStaff } from '@/lib/admin';
import { createCampaign } from '../../../email-actions';
import { AdminTitle, SmallButton } from '../../../ui';

export const metadata = { title: 'New send' };

const SOURCES = [
  ['lead', 'Website form leads'],
  ['subscriber', 'Newsletter subscribers'],
  ['import', 'Uploaded contacts'],
  ['manual', 'Added manually'],
];

export default async function NewCampaign({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const { db } = await requireStaff();
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
          First create an email template. <Link href="/admin/emails/templates/new" className="font-semibold text-amber-ink underline">Create template</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <AdminTitle title="Send a proposal" />
      <form action={createCampaign} className="grid max-w-3xl gap-6">
        <section className="card grid gap-4">
          <div>
            <label className="label" htmlFor="name">Name (internal)</label>
            <input id="name" name="name" required className="field" defaultValue={sp.tag ? `Proposal to ${sp.tag}` : `Proposal ${new Date().toLocaleDateString('en-US')}`} />
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
          <label className="flex items-center gap-2 font-semibold">
            <input type="radio" name="audience" value="tags" defaultChecked={!!sp.tag || tags.length > 0} className="h-4 w-4" /> Contacts with tag
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
            <input type="radio" name="audience" value="sources" defaultChecked={!sp.tag && !tags.length} className="h-4 w-4" /> Contacts from
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
