import Link from 'next/link';
import { Check, Paperclip, Plus, X } from 'lucide-react';
import { requireStaff } from '@/lib/admin';
import { AdminTitle } from '../../ui';

export const metadata = { title: 'Email templates' };

const KIND: Record<string, string> = { proposal: 'Proposal', follow_up: 'Follow-up', newsletter: 'Newsletter', other: 'Other' };

/** The signature every outgoing email should end with. */
const SIGNATURE = 'Regards,\nKameron\nDiesel Dynamix\n(858) 342-8328\nservice@dieseldynamix.com';

function Mark({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={ok ? 'inline-flex items-center gap-1 text-green-ink' : 'inline-flex items-center gap-1 font-semibold text-[#B42318]'}>
      {ok ? <Check className="h-3.5 w-3.5" aria-hidden /> : <X className="h-3.5 w-3.5" aria-hidden />} {label}
    </span>
  );
}

export default async function TemplatesPage() {
  const { db } = await requireStaff();
  const { data } = await db.from('email_templates').select('id,name,kind,subject,body,attachment_name,updated_at').order('kind').order('name');
  // Live check straight from the database: correct signature, no WhatsApp button.
  const checks = (data ?? []).map((t) => ({
    id: t.id,
    signature: String(t.body ?? '').trimEnd().endsWith(SIGNATURE),
    noWhatsapp: !/whatsapp_button/i.test(String(t.body ?? '')),
  }));
  const allGood = checks.every((c) => c.signature && c.noWhatsapp);
  const check = new Map(checks.map((c) => [c.id, c]));
  return (
    <>
      <AdminTitle title="Email templates">
        <Link href="/admin/emails/templates/new" className="inline-flex items-center gap-2 rounded-md bg-accent-deep px-4 py-2 text-sm font-bold text-white hover:bg-accent-hover">
          <Plus className="h-4 w-4" aria-hidden /> New template
        </Link>
      </AdminTitle>
      <p className="mb-4 max-w-3xl text-sm text-muted">
        Write each proposal and follow-up once, then send it to any group of contacts. Use <code>{'{{first_name}}'}</code>, <code>{'{{company}}'}</code> to personalise.
      </p>
      {checks.length ? (
        <p className={allGood ? 'mb-4 rounded-lg bg-green/10 p-3 text-sm font-semibold text-green-ink' : 'mb-4 rounded-lg bg-[#FEF0C7] p-3 text-sm font-semibold text-[#7A4A06]'}>
          {allGood
            ? `Checked ${checks.length} templates: all end with the service@ signature and none has a WhatsApp button.`
            : `${checks.filter((c) => !(c.signature && c.noWhatsapp)).length} template(s) need attention (marked below).`}
        </p>
      ) : null}
      <ul className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white shadow-card">
        {(data ?? []).map((t) => (
          <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <Link href={`/admin/emails/templates/${t.id}`} className="font-semibold hover:underline">{t.name}</Link>
              <p className="text-sm text-muted">{t.subject}</p>
              <p className="mt-1 flex flex-wrap gap-3 text-xs">
                <Mark ok={!!check.get(t.id)?.signature} label="Signature" />
                <Mark ok={!!check.get(t.id)?.noWhatsapp} label="No WhatsApp button" />
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              {t.attachment_name ? <span className="inline-flex items-center gap-1 text-muted"><Paperclip className="h-4 w-4" aria-hidden /> {t.attachment_name}</span> : null}
              <span className="rounded-full bg-offwhite px-2.5 py-0.5 text-xs font-bold uppercase">{KIND[t.kind]}</span>
            </div>
          </li>
        ))}
        {!data?.length ? <li className="px-5 py-8 text-center text-muted">No templates yet.</li> : null}
      </ul>
    </>
  );
}
