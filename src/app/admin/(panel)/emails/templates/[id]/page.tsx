import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Paperclip } from 'lucide-react';
import { requireStaff } from '@/lib/admin';
import { MERGE_TAGS, renderEmail, type Contact, type Template } from '@/lib/campaigns';
import { mailConfigured } from '@/lib/mailer';
import { deleteTemplate, saveTemplate, sendTestEmail } from '../../../email-actions';
import { AdminTitle, SmallButton } from '../../../ui';

export const metadata = { title: 'Edit template' };

const SAMPLE: Contact = { id: '00000000-0000-0000-0000-000000000000', email: 'alex@sampletrucking.com', name: 'Alex Driver', company: 'Sample Trucking LLC', phone: null, source: 'manual', tags: [], status: 'subscribed', replied_at: null, lead_id: null };

export default async function TemplateEditor({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { id } = await params;
  const sp = await searchParams;
  const { db } = await requireStaff();
  const isNew = id === 'new';
  let t: Template = { id: '', name: '', kind: 'proposal', subject: '', body: 'Hi {{first_name}},\n\n', attachment_path: null, attachment_name: null };
  if (!isNew) {
    const { data } = await db.from('email_templates').select('*').eq('id', id).maybeSingle();
    if (!data) notFound();
    t = data as Template;
  }
  const { data: footer } = await db.from('site_settings').select('value').eq('key', 'email_footer_address').maybeSingle();
  let preview = '';
  try {
    preview = isNew ? '' : renderEmail(t, SAMPLE, { footerAddress: typeof footer?.value === 'string' ? footer.value : '' }).html;
  } catch {
    preview = '<p style="font-family:sans-serif">Preview needs SUPABASE_SERVICE_ROLE_KEY or UNSUBSCRIBE_SECRET.</p>';
  }

  return (
    <>
      <Link href="/admin/emails/templates" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All templates
      </Link>
      <AdminTitle title={isNew ? 'New template' : t.name} />
      {sp.saved ? <p role="status" className="mb-4 rounded-md bg-green/10 p-3 text-sm font-semibold text-green-ink">Saved.</p> : null}
      {sp.tested ? <p role="status" className="mb-4 rounded-md bg-green/10 p-3 text-sm font-semibold text-green-ink">Test email sent to your inbox.</p> : null}

      <div className="grid gap-6 2xl:grid-cols-2">
        <form action={saveTemplate} className="card grid content-start gap-4">
          {!isNew ? <input type="hidden" name="id" value={t.id} /> : null}
          <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
            <div>
              <label className="label" htmlFor="name">Template name (internal)</label>
              <input id="name" name="name" defaultValue={t.name} required className="field" placeholder="Fleet testing proposal" />
            </div>
            <div>
              <label className="label" htmlFor="kind">Type</label>
              <select id="kind" name="kind" defaultValue={t.kind} className="field">
                <option value="proposal">Proposal</option>
                <option value="follow_up">Follow-up</option>
                <option value="newsletter">Newsletter</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label" htmlFor="subject">Subject line</label>
            <input id="subject" name="subject" defaultValue={t.subject} required maxLength={200} className="field" placeholder="Mobile Clean Truck Check testing for {{company}}" />
          </div>
          <div>
            <label className="label" htmlFor="body">Email body</label>
            <textarea id="body" name="body" defaultValue={t.body} required rows={16} className="field font-mono text-sm" />
            <p className="mt-1 text-sm text-muted">
              Merge tags: {MERGE_TAGS.map((m) => <code key={m} className="mr-2">{m}</code>)}<br />
              Blank line between paragraphs · <code>**bold**</code> · <code>- bullet</code> · <code>## Heading</code> · <code>[link](https://…)</code>. A blue “Schedule Your Booking” button goes after the first paragraph and a green “Chat on WhatsApp” button at the end, automatically (or place them yourself with <code>{'{{book_button}}'}</code> / <code>{'{{whatsapp_button}}'}</code>). The unsubscribe link and address are added too.
            </p>
          </div>
          <div>
            <label className="label" htmlFor="attachment">Attach proposal (PDF, max 4 MB)</label>
            {t.attachment_name ? (
              <p className="mb-2 flex items-center gap-2 text-sm">
                <Paperclip className="h-4 w-4" aria-hidden /> {t.attachment_name}
                <label className="ml-3 inline-flex items-center gap-1 text-[#B42318]"><input type="checkbox" name="remove_attachment" /> remove</label>
              </p>
            ) : null}
            <input id="attachment" name="attachment" type="file" accept=".pdf,.doc,.docx,.png,.jpg" className="block text-sm" />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <SmallButton className="px-5 py-2.5">Save template</SmallButton>
            {!isNew ? (
              <>
                <button formAction={sendTestEmail.bind(null, t.id)} formNoValidate disabled={!mailConfigured()} className="rounded-md border border-ink/20 px-4 py-2 text-sm font-semibold disabled:opacity-50" title={mailConfigured() ? 'Sends to your login email' : 'Add SMTP settings first'}>
                  Send test to me
                </button>
                <button formAction={deleteTemplate.bind(null, t.id)} formNoValidate className="text-sm font-semibold text-[#B42318] underline underline-offset-4">Delete</button>
              </>
            ) : null}
          </div>
        </form>

        {!isNew ? (
          <section className="card content-start">
            <h2 className="text-2xl">Preview</h2>
            <p className="mb-3 text-sm text-muted">Shown with sample data (Alex Driver, Sample Trucking LLC). Save to refresh.</p>
            <iframe title="Email preview" srcDoc={preview} sandbox="" className="h-[640px] w-full rounded-lg border border-ink/10 bg-white" />
          </section>
        ) : null}
      </div>
    </>
  );
}
