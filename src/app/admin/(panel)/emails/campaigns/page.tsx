import Link from 'next/link';
import { Send } from 'lucide-react';
import { requireStaff } from '@/lib/admin';
import { cn } from '@/lib/utils';
import { AdminTitle, CAMPAIGN_STATUS } from '../../ui';

export const metadata = { title: 'Send proposals' };

export default async function CampaignsPage() {
  const { db } = await requireStaff();
  const { data } = await db.from('campaigns').select('id,name,status,created_at,started_at,email_templates(name)').order('created_at', { ascending: false }).limit(100);
  return (
    <>
      <AdminTitle title="Send proposals">
        <Link href="/admin/emails/campaigns/new" className="inline-flex items-center gap-2 rounded-md bg-accent-deep px-4 py-2 text-sm font-bold text-white hover:bg-accent-hover">
          <Send className="h-4 w-4" aria-hidden /> New send
        </Link>
      </AdminTitle>
      <ol className="mb-6 grid max-w-4xl gap-3 text-sm sm:grid-cols-3">
        {[
          ['1. Upload emails', '/admin/contacts/import', 'CSV or paste a list, give it a tag.'],
          ['2. Write the proposal', '/admin/emails/templates', 'Plus follow-up emails, with a PDF if you like.'],
          ['3. Send', '/admin/emails/campaigns/new', 'Pick the group, add follow-ups, click send.'],
        ].map(([t, href, d]) => (
          <li key={t}>
            <Link href={href} className="card block !p-4 hover:border-accent-ink">
              <span className="font-display text-lg font-bold uppercase">{t}</span>
              <span className="block text-muted">{d}</span>
            </Link>
          </li>
        ))}
      </ol>
      <ul className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white shadow-card">
        {(data ?? []).map((c) => (
          <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <Link href={`/admin/emails/campaigns/${c.id}`} className="font-semibold hover:underline">{c.name}</Link>
              <p className="text-sm text-muted">
                {(c.email_templates as unknown as { name: string } | null)?.name} · {new Date(c.started_at ?? c.created_at).toLocaleDateString('en-US')}
              </p>
            </div>
            <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold uppercase', CAMPAIGN_STATUS[c.status])}>{c.status}</span>
          </li>
        ))}
        {!data?.length ? <li className="px-5 py-8 text-center text-muted">Nothing sent yet.</li> : null}
      </ul>
    </>
  );
}
