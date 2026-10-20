import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { ENGINE_LABELS, LEAD_STATUSES, requireStaff, toLaInput, type Lead } from '@/lib/admin';
import { addNote, deleteLead, updateLead } from '../../actions';
import { AdminTitle, SmallButton, StatusBadge } from '../../ui';

export const metadata = { title: 'Lead' };

const fmt = (iso: string) => new Date(iso).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', dateStyle: 'medium', timeStyle: 'short' });

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { db, profile } = await requireStaff();
  const [{ data }, notes, team] = await Promise.all([
    db.from('leads').select('*').eq('id', id).maybeSingle(),
    db.from('lead_notes').select('id,body,created_at,author_id').eq('lead_id', id).order('created_at', { ascending: false }),
    db.from('profiles').select('id,full_name').order('full_name'),
  ]);
  if (!data) notFound();
  const lead = data as Lead;
  const names = new Map((team.data ?? []).map((p) => [p.id, p.full_name]));

  const details: [string, React.ReactNode][] = [
    ['Type', lead.kind === 'booking' ? 'Booking request' : 'Contact message'],
    ['Received', fmt(lead.created_at)],
    ['Company', lead.company],
    ['Trucks', lead.trucks],
    ['Location', lead.location],
    ['Engine type', lead.engine_type ? ENGINE_LABELS[lead.engine_type] : null],
    ['Preferred date', lead.preferred_date],
    ['Customer notes', lead.notes],
    ['Message', lead.message],
    ['Submitted from', lead.source_page],
  ];

  return (
    <>
      <Link href="/admin" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All leads
      </Link>
      <AdminTitle title={lead.full_name}>
        <StatusBadge status={lead.status} />
      </AdminTitle>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="grid content-start gap-6">
          <section className="card">
            <div className="flex flex-wrap gap-3">
              {lead.phone ? (
                <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-2 rounded-md bg-charcoal px-4 py-2 text-sm font-semibold text-white">
                  <Phone className="h-4 w-4" aria-hidden /> {lead.phone}
                </a>
              ) : null}
              <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-2 rounded-md border border-ink/20 px-4 py-2 text-sm font-semibold">
                <Mail className="h-4 w-4" aria-hidden /> {lead.email}
              </a>
            </div>
            <dl className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-[10rem_1fr]">
              {details
                .filter(([, v]) => v !== null && v !== undefined && v !== '')
                .map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-sm font-semibold text-muted">{k}</dt>
                    <dd className="whitespace-pre-wrap">{v}</dd>
                  </div>
                ))}
            </dl>
          </section>

          <section className="card">
            <h2 className="text-2xl">Notes</h2>
            <form action={addNote.bind(null, lead.id)} className="mt-3 grid gap-2">
              <label htmlFor="note" className="sr-only">Add a note</label>
              <textarea id="note" name="body" rows={3} required maxLength={4000} className="field" placeholder="Called, left voicemail…" />
              <SmallButton className="justify-self-start">Add note</SmallButton>
            </form>
            <ul className="mt-5 grid gap-3">
              {(notes.data ?? []).map((n) => (
                <li key={n.id} className="rounded-lg bg-offwhite p-3">
                  <p className="whitespace-pre-wrap">{n.body}</p>
                  <p className="mt-1 text-xs text-muted">
                    {names.get(n.author_id) ?? 'Staff'} · {fmt(n.created_at)}
                  </p>
                </li>
              ))}
              {!notes.data?.length ? <li className="text-sm text-muted">No notes yet.</li> : null}
            </ul>
          </section>
        </div>

        <section className="card content-start">
          <h2 className="text-2xl">Status &amp; appointment</h2>
          <form action={updateLead.bind(null, lead.id)} className="mt-4 grid gap-4">
            <div>
              <label htmlFor="status" className="label">Status</label>
              <select id="status" name="status" defaultValue={lead.status} className="field capitalize">
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="assigned_to" className="label">Assigned to</label>
              <select id="assigned_to" name="assigned_to" defaultValue={lead.assigned_to ?? ''} className="field">
                <option value="">Unassigned</option>
                {(team.data ?? []).map((p) => (
                  <option key={p.id} value={p.id}>{p.full_name || p.id.slice(0, 8)}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="appointment_at" className="label">Appointment (California time)</label>
              <input id="appointment_at" name="appointment_at" type="datetime-local" defaultValue={toLaInput(lead.appointment_at)} className="field" />
            </div>
            <SmallButton className="justify-self-start px-5 py-2.5">Save</SmallButton>
          </form>
          {profile.role === 'admin' ? (
            <form action={deleteLead.bind(null, lead.id)} className="mt-8 border-t border-ink/10 pt-4">
              <button className="text-sm font-semibold text-[#B42318] underline underline-offset-4">Delete lead permanently</button>
            </form>
          ) : null}
        </section>
      </div>
    </>
  );
}
