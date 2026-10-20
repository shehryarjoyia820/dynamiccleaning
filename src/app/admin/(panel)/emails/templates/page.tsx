import Link from 'next/link';
import { Paperclip, Plus } from 'lucide-react';
import { requireStaff } from '@/lib/admin';
import { AdminTitle } from '../../ui';

export const metadata = { title: 'Email templates' };

const KIND: Record<string, string> = { proposal: 'Proposal', follow_up: 'Follow-up', newsletter: 'Newsletter', other: 'Other' };

export default async function TemplatesPage() {
  const { db } = await requireStaff();
  const { data } = await db.from('email_templates').select('id,name,kind,subject,attachment_name,updated_at').order('kind').order('name');
  return (
    <>
      <AdminTitle title="Email templates">
        <Link href="/admin/emails/templates/new" className="inline-flex items-center gap-2 rounded-md bg-amber px-4 py-2 text-sm font-bold text-ink hover:bg-amber-deep">
          <Plus className="h-4 w-4" aria-hidden /> New template
        </Link>
      </AdminTitle>
      <p className="mb-4 max-w-3xl text-sm text-muted">
        Write each proposal and follow-up once, then send it to any group of contacts. Use <code>{'{{first_name}}'}</code>, <code>{'{{company}}'}</code> to personalise.
      </p>
      <ul className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white shadow-card">
        {(data ?? []).map((t) => (
          <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <Link href={`/admin/emails/templates/${t.id}`} className="font-semibold hover:underline">{t.name}</Link>
              <p className="text-sm text-muted">{t.subject}</p>
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
