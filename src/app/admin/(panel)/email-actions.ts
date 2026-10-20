'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireStaff, userError } from '@/lib/admin';
import { processQueue, renderEmail, startCampaign, upsertContact, type Audience, type Contact, type Followup } from '@/lib/campaigns';
import { MARKETING_FROM, addressOf, mailConfigured, sendMail } from '@/lib/mailer';
import { serviceClient } from '@/lib/supabase/clients';

const get = (f: FormData, k: string) => String(f.get(k) ?? '').trim();
const tagList = (s: string) =>
  Array.from(new Set(s.split(',').map((t) => t.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '')).filter(Boolean))).slice(0, 20);

function svc() {
  const db = serviceClient();
  if (!db) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  return db;
}

// CAN-SPAM: marketing email must carry a postal address, so sending waits until one is set.
async function requireFooterAddress() {
  const { data } = await svc().from('site_settings').select('value').eq('key', 'email_footer_address').maybeSingle();
  if (typeof data?.value !== 'string' || data.value.trim().length < 10) {
    return userError('Add your postal address under Settings → Email footer address before sending (required by US law).');
  }
}

// ---------------------------------------------------------------- Contacts

export async function saveContact(form: FormData) {
  const { db } = await requireStaff();
  const id = get(form, 'id');
  const row = {
    email: z.string().email().parse(get(form, 'email').toLowerCase()),
    name: get(form, 'name') || null,
    company: get(form, 'company') || null,
    phone: get(form, 'phone') || null,
    tags: tagList(get(form, 'tags')),
  };
  const { error } = id
    ? await db.from('contacts').update(row).eq('id', id)
    : await db.from('contacts').insert({ ...row, source: 'manual' });
  if (error) return userError(error.message.includes('duplicate') ? 'That email is already a contact' : error.message);
  revalidatePath('/admin/contacts');
  if (id) revalidatePath(`/admin/contacts/${id}`);
}

export async function setContactStatus(id: string, status: 'subscribed' | 'unsubscribed') {
  const { db } = await requireStaff();
  await db
    .from('contacts')
    .update({ status, unsubscribed_at: status === 'unsubscribed' ? new Date().toISOString() : null })
    .eq('id', id);
  if (status === 'unsubscribed') await db.from('email_sends').update({ status: 'cancelled', error: 'Unsubscribed' }).eq('contact_id', id).eq('status', 'queued');
  revalidatePath(`/admin/contacts/${id}`);
}

export async function setReplied(id: string, replied: boolean) {
  const { db } = await requireStaff();
  await db.from('contacts').update({ replied_at: replied ? new Date().toISOString() : null }).eq('id', id);
  revalidatePath(`/admin/contacts/${id}`);
}

export async function deleteContact(id: string) {
  const { db } = await requireStaff({ admin: true });
  await db.from('contacts').delete().eq('id', id);
  revalidatePath('/admin/contacts');
  redirect('/admin/contacts');
}

export type ImportResult = { ok: boolean; message: string; tag?: string; added?: number; invalid?: string[] };

/** Accepts CSV with a header row (email, name, company, phone) or one email per line. */
export async function importContacts(_prev: ImportResult | null, form: FormData): Promise<ImportResult> {
  await requireStaff();
  if (form.get('confirm') !== 'on') return { ok: false, message: 'Please confirm you are allowed to email these contacts.' };
  const text = get(form, 'csv');
  if (!text) return { ok: false, message: 'Paste emails or choose a CSV file.' };
  const tag = tagList(get(form, 'tag'))[0] || `import-${new Date().toISOString().slice(0, 10)}`;

  const split = (line: string) => {
    const out: string[] = [];
    let cur = '';
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (q && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else q = !q;
      } else if ((ch === ',' || ch === ';' || ch === '\t') && !q) {
        out.push(cur.trim());
        cur = '';
      } else cur += ch;
    }
    out.push(cur.trim());
    return out;
  };

  const lines = text.replace(/\r/g, '').split('\n').filter((l) => l.trim());
  const head = split(lines[0]).map((h) => h.toLowerCase());
  const hasHeader = head.some((h) => /e-?mail/.test(h));
  const col = (re: RegExp) => (hasHeader ? head.findIndex((h) => re.test(h)) : -1);
  const ci = { email: hasHeader ? col(/e-?mail/) : 0, name: col(/name|contact/), company: col(/company|business|organi[sz]ation/), phone: col(/phone|mobile|tel/) };
  const rows = (hasHeader ? lines.slice(1) : lines).slice(0, 5000);

  const db = svc();
  const invalid: string[] = [];
  let added = 0;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  for (const line of rows) {
    const cells = split(line);
    // Without a header, pick whichever cell looks like an email.
    const email = (ci.email >= 0 ? cells[ci.email] : cells.find((c) => emailRe.test(c)))?.toLowerCase() ?? '';
    if (!emailRe.test(email)) {
      if (invalid.length < 20) invalid.push(line.slice(0, 80));
      continue;
    }
    await upsertContact(db, {
      email,
      name: ci.name >= 0 ? cells[ci.name] : null,
      company: ci.company >= 0 ? cells[ci.company] : null,
      phone: ci.phone >= 0 ? cells[ci.phone] : null,
      source: 'import',
      tags: [tag],
    });
    added++;
  }
  revalidatePath('/admin/contacts');
  return { ok: true, message: `Imported ${added} contact(s) with tag “${tag}”.`, tag, added, invalid };
}

// ---------------------------------------------------------------- Templates

const MAX_ATTACHMENT = 4 * 1024 * 1024;

export async function saveTemplate(form: FormData) {
  const { db } = await requireStaff();
  const id = get(form, 'id');
  const row: Record<string, unknown> = {
    name: z.string().min(1).max(120).parse(get(form, 'name')),
    kind: z.enum(['proposal', 'follow_up', 'newsletter', 'other']).parse(get(form, 'kind')),
    subject: z.string().min(1).max(200).parse(get(form, 'subject')),
    body: z.string().min(1).max(20000).parse(get(form, 'body')),
  };
  const file = form.get('attachment');
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_ATTACHMENT) return userError('Attachment must be 4 MB or smaller');
    const safe = file.name.replace(/[^\w.-]+/g, '-').slice(-80);
    const path = `${crypto.randomUUID()}/${safe}`;
    const { error } = await svc().storage.from('email-attachments').upload(path, file, { contentType: file.type || 'application/octet-stream' });
    if (error) return userError(error.message);
    row.attachment_path = path;
    row.attachment_name = file.name.slice(-120);
  }
  if (form.get('remove_attachment') === 'on') {
    row.attachment_path = null;
    row.attachment_name = null;
  }
  const res = id ? await db.from('email_templates').update(row).eq('id', id).select('id').single() : await db.from('email_templates').insert(row).select('id').single();
  if (res.error) return userError(res.error.message);
  revalidatePath('/admin/emails/templates');
  redirect(`/admin/emails/templates/${res.data.id}?saved=1`);
}

export async function deleteTemplate(id: string) {
  const { db } = await requireStaff();
  const { error } = await db.from('email_templates').delete().eq('id', id);
  if (error) return userError(error.message.includes('foreign key') ? 'This template is used by a campaign and cannot be deleted' : error.message);
  revalidatePath('/admin/emails/templates');
  redirect('/admin/emails/templates');
}

/** Sends a template to the signed-in staff member with sample merge data. */
export async function sendTestEmail(templateId: string) {
  const { db, user } = await requireStaff();
  if (!mailConfigured()) return userError('Email is not configured yet (add SMTP settings)');
  const { data: t } = await db.from('email_templates').select('*').eq('id', templateId).single();
  if (!t || !user.email) return userError('Template not found');
  const { data: footer } = await db.from('site_settings').select('value').eq('key', 'email_footer_address').maybeSingle();
  const sample: Contact = { id: '00000000-0000-0000-0000-000000000000', email: user.email, name: 'Alex Driver', company: 'Sample Trucking LLC', phone: null, source: 'manual', tags: [], status: 'subscribed', replied_at: null, lead_id: null };
  const mail = renderEmail(t, sample, { footerAddress: typeof footer?.value === 'string' ? footer.value : '' });
  let attachments;
  if (t.attachment_path) {
    const { data } = await svc().storage.from('email-attachments').download(t.attachment_path);
    if (data) attachments = [{ filename: t.attachment_name || 'proposal.pdf', content: Buffer.from(await data.arrayBuffer()) }];
  }
  const res = await sendMail({ to: user.email, ...mail, subject: `[TEST] ${mail.subject}`, attachments, channel: 'marketing', replyTo: addressOf(MARKETING_FROM) });
  if (!res.ok) return userError(res.error ?? 'Send failed');
  redirect(`/admin/emails/templates/${templateId}?tested=1`);
}

// ---------------------------------------------------------------- Campaigns

function parseFollowups(form: FormData): Followup[] {
  const ids = form.getAll('fu_template').map(String);
  const days = form.getAll('fu_days').map(String);
  return ids
    .map((template_id, i) => ({ template_id, delay_days: Math.max(1, Math.min(90, Number(days[i]) || 0)) }))
    .filter((f) => f.template_id)
    .slice(0, 3);
}

async function parseAudience(form: FormData): Promise<Audience> {
  const type = get(form, 'audience');
  if (type === 'tags') {
    const tags = form.getAll('tags').map(String).filter(Boolean);
    if (!tags.length) return userError('Choose at least one tag');
    return { type, tags };
  }
  if (type === 'sources') {
    const sources = form.getAll('sources').map(String).filter(Boolean);
    if (!sources.length) return userError('Choose at least one source');
    return { type, sources };
  }
  return { type: 'all' };
}

export async function createCampaign(form: FormData) {
  const { db, user } = await requireStaff();
  const { data, error } = await db
    .from('campaigns')
    .insert({
      name: z.string().min(1).max(160).parse(get(form, 'name')),
      template_id: z.string().uuid().parse(get(form, 'template_id')),
      audience: await parseAudience(form),
      followups: parseFollowups(form),
      created_by: user.id,
    })
    .select('id')
    .single();
  if (error) return userError(error.message);
  revalidatePath('/admin/emails/campaigns');
  redirect(`/admin/emails/campaigns/${data.id}`);
}

export async function launchCampaign(id: string) {
  await requireStaff();
  if (!mailConfigured()) return userError('Email is not configured yet (add SMTP settings)');
  await requireFooterAddress();
  let error = '';
  try {
    await startCampaign(svc(), id);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Could not start sending';
  }
  if (error) return userError(error);
  revalidatePath(`/admin/emails/campaigns/${id}`);
}

export async function setCampaignPaused(id: string, paused: boolean) {
  const { db } = await requireStaff();
  await db.from('campaigns').update({ status: paused ? 'paused' : 'sending' }).eq('id', id).in('status', paused ? ['sending'] : ['paused']);
  revalidatePath(`/admin/emails/campaigns/${id}`);
}

export async function cancelCampaign(id: string) {
  const { db } = await requireStaff();
  await db.from('email_sends').update({ status: 'cancelled', error: 'Cancelled by staff' }).eq('campaign_id', id).eq('status', 'queued');
  await db.from('campaigns').update({ status: 'sent' }).eq('id', id);
  revalidatePath(`/admin/emails/campaigns/${id}`);
}

export async function deleteCampaign(id: string) {
  const { db } = await requireStaff();
  await db.from('campaigns').delete().eq('id', id).eq('status', 'draft');
  revalidatePath('/admin/emails/campaigns');
  redirect('/admin/emails/campaigns');
}

/** Called repeatedly by the campaign page while it is open, so sending doesn't wait for the daily cron. */
export async function processNow() {
  await requireStaff();
  return processQueue(svc(), { maxMs: 25000 });
}

/** One-off proposal (plus optional follow-ups) to a single lead from the lead page. */
export async function emailLead(leadId: string, form: FormData) {
  const { db, user } = await requireStaff();
  if (!mailConfigured()) return userError('Email is not configured yet (add SMTP settings)');
  await requireFooterAddress();
  const { data: lead } = await db.from('leads').select('id,full_name,email,company,phone').eq('id', leadId).single();
  if (!lead) return userError('Lead not found');
  const s = svc();
  const contactId = await upsertContact(s, { email: lead.email, name: lead.full_name, company: lead.company, phone: lead.phone, source: 'lead', lead_id: lead.id });
  const { data: contact } = await s.from('contacts').select('status').eq('id', contactId).single();
  if (contact?.status !== 'subscribed') return userError('This contact has unsubscribed from emails');
  const templateId = z.string().uuid().parse(get(form, 'template_id'));
  const { data: c, error } = await db
    .from('campaigns')
    .insert({ name: `Lead: ${lead.full_name}`, template_id: templateId, audience: { type: 'contacts', ids: [contactId] }, followups: parseFollowups(form), created_by: user.id })
    .select('id')
    .single();
  if (error) return userError(error.message);
  await startCampaign(s, c.id);
  await processQueue(s, { maxMs: 15000 });
  if ((await db.from('leads').select('status').eq('id', leadId).single()).data?.status === 'new') {
    await db.from('leads').update({ status: 'contacted' }).eq('id', leadId);
  }
  revalidatePath(`/admin/leads/${leadId}`);
  redirect(`/admin/emails/campaigns/${c.id}`);
}
