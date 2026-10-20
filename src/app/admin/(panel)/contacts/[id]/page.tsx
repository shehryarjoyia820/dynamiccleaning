import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { requireStaff } from '@/lib/admin';
import { deleteContact, saveContact, setContactStatus, setInterested, setReplied } from '../../email-actions';
import { AdminTitle, SmallButton } from '../../ui';

export const metadata = { title: 'Contact' };

const fmt = (iso: string) => new Date(iso).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', dateStyle: 'medium', timeStyle: 'short' });

export default async function ContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { db, profile } = await requireStaff();
  const [{ data: c }, { data: sends }] = await Promise.all([
    db.from('contacts').select('*').eq('id', id).maybeSingle(),
    db.from('email_sends').select('id,step,status,sent_at,opened_at,open_count,send_after,error,campaigns(id,name),email_templates(name)').eq('contact_id', id).order('created_at', { ascending: false }).limit(100),
  ]);
  if (!c) notFound();

  return (
    <>
      <Link href="/admin/contacts" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All contacts
      </Link>
      <AdminTitle title={c.name || c.email}>
        <span className={c.status === 'subscribed' ? 'text-sm font-bold uppercase text-green-ink' : 'text-sm font-bold uppercase text-[#B42318]'}>{c.status}</span>
      </AdminTitle>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <section className="card content-start">
          <form action={saveContact} className="grid gap-3">
            <input type="hidden" name="id" value={c.id} />
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" defaultValue={c.email} required className="field" />
            <label className="label" htmlFor="name">Name</label>
            <input id="name" name="name" defaultValue={c.name ?? ''} className="field" />
            <label className="label" htmlFor="company">Company</label>
            <input id="company" name="company" defaultValue={c.company ?? ''} className="field" />
            <label className="label" htmlFor="phone">Phone</label>
            <input id="phone" name="phone" defaultValue={c.phone ?? ''} className="field" />
            <label className="label" htmlFor="tags">Tags (comma separated)</label>
            <input id="tags" name="tags" defaultValue={(c.tags as string[]).join(', ')} className="field" />
            <SmallButton className="justify-self-start">Save</SmallButton>
          </form>
          <div className="mt-6 flex flex-wrap gap-3 border-t border-ink/10 pt-4 text-sm">
            <form action={setInterested.bind(null, c.id, !(c.tags as string[]).includes('interested'))}>
              <button className={(c.tags as string[]).includes('interested') ? 'rounded-md bg-green/15 px-3 py-2 font-semibold text-green-ink' : 'rounded-md border border-ink/20 px-3 py-2 font-semibold'}>
                {(c.tags as string[]).includes('interested') ? '★ Interested (remove)' : '☆ Mark as interested'}
              </button>
            </form>
            <form action={setReplied.bind(null, c.id, !c.replied_at)}>
              <button className="rounded-md border border-ink/20 px-3 py-2 font-semibold">{c.replied_at ? 'Clear “replied”' : 'Mark as replied (stops follow-ups)'}</button>
            </form>
            <form action={setContactStatus.bind(null, c.id, c.status === 'subscribed' ? 'unsubscribed' : 'subscribed')}>
              <button className="rounded-md border border-ink/20 px-3 py-2 font-semibold">{c.status === 'subscribed' ? 'Unsubscribe' : 'Re-subscribe (only with their permission)'}</button>
            </form>
            {c.lead_id ? <Link href={`/admin/leads/${c.lead_id}`} className="rounded-md border border-ink/20 px-3 py-2 font-semibold">Open lead</Link> : null}
            {profile.role === 'admin' ? (
              <form action={deleteContact.bind(null, c.id)}>
                <button className="px-1 py-2 font-semibold text-[#B42318] underline underline-offset-4">Delete</button>
              </form>
            ) : null}
          </div>
          <p className="mt-4 text-xs text-muted">Source: {c.source} · added {fmt(c.created_at)}{c.unsubscribed_at ? ` · unsubscribed ${fmt(c.unsubscribed_at)}` : ''}</p>
        </section>

        <section className="card content-start">
          <h2 className="text-2xl">Email history</h2>
          <ul className="mt-4 divide-y divide-ink/10 text-sm">
            {(sends ?? []).map((s) => {
              const camp = s.campaigns as unknown as { id: string; name: string } | null;
              const tpl = s.email_templates as unknown as { name: string } | null;
              return (
                <li key={s.id} className="py-3">
                  <p className="font-semibold">
                    {tpl?.name ?? 'Email'} <span className="font-normal text-muted">· {s.step === 0 ? 'first email' : `follow-up ${s.step}`}</span>
                  </p>
                  <p className="text-muted">
                    <span className="font-semibold uppercase">{s.status}</span>
                    {s.sent_at ? ` · sent ${fmt(s.sent_at)}` : s.status === 'queued' ? ` · scheduled ${fmt(s.send_after)}` : ''}
                    {s.opened_at ? ` · opened ${(s as { open_count?: number }).open_count ?? 1}× (first ${fmt(s.opened_at)})` : ''}
                    {s.error && s.status !== 'sent' ? ` · ${s.error}` : ''}
                  </p>
                  {camp ? <Link href={`/admin/emails/campaigns/${camp.id}`} className="text-xs underline">{camp.name}</Link> : null}
                </li>
              );
            })}
            {!sends?.length ? <li className="py-3 text-muted">No emails sent yet.</li> : null}
          </ul>
        </section>
      </div>
    </>
  );
}
