import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { esc, shell } from '@/lib/email';
import { mailConfigured, sendMail } from '@/lib/mailer';
import { SITE } from '@/lib/site';

export type Contact = {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  phone: string | null;
  source: string;
  tags: string[];
  status: 'subscribed' | 'unsubscribed' | 'bounced';
  replied_at: string | null;
  lead_id: string | null;
};

export type Template = {
  id: string;
  name: string;
  kind: string;
  subject: string;
  body: string;
  attachment_path: string | null;
  attachment_name: string | null;
};

export type Audience =
  | { type: 'all' }
  | { type: 'tags'; tags: string[] }
  | { type: 'sources'; sources: string[] }
  | { type: 'contacts'; ids: string[] };

export type Followup = { template_id: string; delay_days: number };

export const MERGE_TAGS = ['{{first_name}}', '{{name}}', '{{company}}', '{{email}}'];

// Leads that reached these statuses have converted, so follow-ups stop.
const CONVERTED = ['scheduled', 'completed', 'closed'];

// ------------------------------------------------------------------ rendering

function inlineMd(s: string) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|tel:[^\s)]+)\)/g, '<a href="$2" style="color:#8F5600">$1</a>');
}

/** Minimal Markdown → email-safe HTML. Text is escaped before any markup is added. */
export function markdownToHtml(md: string) {
  return md
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((block) => {
      const b = esc(block.trim());
      if (!b) return '';
      if (b.startsWith('## ')) return `<h2 style="font-size:20px;margin:24px 0 8px">${inlineMd(b.slice(3))}</h2>`;
      const lines = b.split('\n');
      if (lines.every((l) => /^[-*] /.test(l)))
        return `<ul style="padding-left:20px;margin:12px 0">${lines.map((l) => `<li style="margin:4px 0">${inlineMd(l.slice(2))}</li>`).join('')}</ul>`;
      return `<p style="margin:12px 0;line-height:1.6">${lines.map(inlineMd).join('<br>')}</p>`;
    })
    .join('');
}

export function applyMergeTags(text: string, c: Pick<Contact, 'email' | 'name' | 'company'>) {
  const first = (c.name ?? '').trim().split(/\s+/)[0] || 'there';
  return text
    .replace(/{{\s*first_name\s*}}/g, first)
    .replace(/{{\s*name\s*}}/g, c.name?.trim() || 'there')
    .replace(/{{\s*company\s*}}/g, c.company?.trim() || 'your company')
    .replace(/{{\s*email\s*}}/g, c.email);
}

function secret() {
  const s = process.env.UNSUBSCRIBE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!s) throw new Error('UNSUBSCRIBE_SECRET is not set');
  return s;
}

export function unsubscribeToken(contactId: string) {
  return createHmac('sha256', secret()).update(contactId).digest('base64url').slice(0, 32);
}

export function verifyUnsubscribe(contactId: string, token: string) {
  try {
    const a = Buffer.from(unsubscribeToken(contactId));
    const b = Buffer.from(token);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function unsubscribeUrls(contactId: string) {
  const q = `c=${contactId}&t=${unsubscribeToken(contactId)}`;
  return { page: `${SITE.url}/unsubscribe?${q}`, oneClick: `${SITE.url}/api/unsubscribe?${q}` };
}

export function renderEmail(t: Pick<Template, 'subject' | 'body'>, c: Contact, opts: { sendId?: string; footerAddress: string }) {
  const subject = applyMergeTags(t.subject, c);
  const bodyMd = applyMergeTags(t.body, c);
  const urls = unsubscribeUrls(c.id);
  const footer = `${opts.footerAddress ? `${esc(opts.footerAddress)}<br>` : ''}You are receiving this because you contacted or subscribed to Diesel Dynamix.
    <a href="${urls.page}" style="color:#4A5160">Unsubscribe</a><br>`;
  const pixel = opts.sendId ? `<img src="${SITE.url}/api/t/${opts.sendId}" width="1" height="1" alt="" style="display:block;border:0">` : '';
  const html = shell(markdownToHtml(bodyMd) + pixel, footer);
  const text = `${bodyMd.replace(/\*\*/g, '')}\n\n--\n${opts.footerAddress}\nUnsubscribe: ${urls.page}`;
  return {
    subject,
    html,
    text,
    headers: {
      'List-Unsubscribe': `<${urls.oneClick}>, <mailto:${SITE.emailService}?subject=unsubscribe>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  };
}

// ------------------------------------------------------------------ audience

export async function resolveAudience(db: SupabaseClient, a: Audience) {
  const out: Contact[] = [];
  for (let from = 0; ; from += 1000) {
    let q = db.from('contacts').select('*').eq('status', 'subscribed').order('created_at').range(from, from + 999);
    if (a.type === 'tags') q = q.overlaps('tags', a.tags);
    if (a.type === 'sources') q = q.in('source', a.sources);
    if (a.type === 'contacts') q = q.in('id', a.ids.slice(0, 1000));
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    out.push(...((data ?? []) as Contact[]));
    if (!data || data.length < 1000 || a.type === 'contacts') break;
  }
  return out;
}

/** Queues the first email for every recipient plus each follow-up step, then marks the campaign as sending. */
export async function startCampaign(db: SupabaseClient, campaignId: string) {
  const { data: c, error } = await db.from('campaigns').select('*').eq('id', campaignId).single();
  if (error || !c) throw new Error(error?.message ?? 'Campaign not found');
  if (c.status !== 'draft') throw new Error('Campaign was already started');
  const recipients = await resolveAudience(db, c.audience as Audience);
  if (!recipients.length) throw new Error('No subscribed contacts match this audience');

  const now = Date.now();
  const followups = (c.followups ?? []) as Followup[];
  const rows = recipients.flatMap((r) => [
    { campaign_id: c.id, contact_id: r.id, template_id: c.template_id, step: 0, delay_days: 0, send_after: new Date(now).toISOString() },
    ...followups.map((f, i) => ({
      campaign_id: c.id,
      contact_id: r.id,
      template_id: f.template_id,
      step: i + 1,
      delay_days: f.delay_days,
      send_after: new Date(now + f.delay_days * 86400000).toISOString(),
    })),
  ]);
  for (let i = 0; i < rows.length; i += 500) {
    const { error: e } = await db.from('email_sends').upsert(rows.slice(i, i + 500), { onConflict: 'campaign_id,contact_id,step', ignoreDuplicates: true });
    if (e) throw new Error(e.message);
  }
  await db.from('campaigns').update({ status: 'sending', started_at: new Date().toISOString() }).eq('id', c.id);
  return recipients.length;
}

// ------------------------------------------------------------------ sending

const DAILY_LIMIT = Number(process.env.EMAIL_DAILY_LIMIT || 400);

type Claimed = { id: string; campaign_id: string; contact_id: string; template_id: string; step: number; delay_days: number };

/**
 * Sends due messages until `maxMs` runs out. Safe to call from several places at once
 * (cron + admin button): rows are claimed atomically by claim_email_sends().
 */
export async function processQueue(db: SupabaseClient, opts: { maxMs?: number; batch?: number } = {}) {
  const started = Date.now();
  const maxMs = opts.maxMs ?? 45000;
  const stats = { sent: 0, failed: 0, skipped: 0, limited: false, notConfigured: false };
  if (!mailConfigured()) return { ...stats, notConfigured: true, due: 0 };

  const { data: footerRow } = await db.from('site_settings').select('value').eq('key', 'email_footer_address').maybeSingle();
  const footerAddress = typeof footerRow?.value === 'string' ? footerRow.value : '';
  const templates = new Map<string, Template>();
  const attachments = new Map<string, Buffer | null>();
  const touched = new Set<string>();

  while (Date.now() - started < maxMs) {
    const since = new Date(Date.now() - 86400000).toISOString();
    const { count } = await db.from('email_sends').select('id', { count: 'exact', head: true }).eq('status', 'sent').gte('sent_at', since);
    const room = DAILY_LIMIT - (count ?? 0);
    if (room <= 0) {
      stats.limited = true;
      break;
    }
    const { data: claimed, error } = await db.rpc('claim_email_sends', { batch: Math.min(opts.batch ?? 10, room) });
    if (error) throw new Error(error.message);
    const rows = (claimed ?? []) as Claimed[];
    if (!rows.length) break;

    for (const row of rows) {
      touched.add(row.campaign_id);
      const finish = (patch: Record<string, unknown>) => db.from('email_sends').update(patch).eq('id', row.id);
      const { data: contact } = await db.from('contacts').select('*').eq('id', row.contact_id).single();
      const c = contact as Contact | null;

      let skip: string | null = null;
      if (!c || c.status !== 'subscribed') skip = 'Contact unsubscribed';
      else if (row.step > 0) {
        if (c.replied_at) skip = 'Contact replied';
        const { data: first } = await db.from('email_sends').select('status').eq('campaign_id', row.campaign_id).eq('contact_id', row.contact_id).eq('step', 0).maybeSingle();
        if (!skip && first?.status !== 'sent') skip = 'First email was not sent';
        if (!skip && c.lead_id) {
          const { data: lead } = await db.from('leads').select('status').eq('id', c.lead_id).maybeSingle();
          if (lead && CONVERTED.includes(lead.status)) skip = `Lead is ${lead.status}`;
        }
      }
      if (skip) {
        await finish({ status: 'skipped', error: skip });
        stats.skipped++;
        continue;
      }

      let t = templates.get(row.template_id);
      if (!t) {
        const { data } = await db.from('email_templates').select('*').eq('id', row.template_id).single();
        t = data as Template;
        templates.set(row.template_id, t);
      }
      let file: Buffer | null = null;
      if (t.attachment_path) {
        if (!attachments.has(t.attachment_path)) {
          const { data } = await db.storage.from('email-attachments').download(t.attachment_path);
          attachments.set(t.attachment_path, data ? Buffer.from(await data.arrayBuffer()) : null);
        }
        file = attachments.get(t.attachment_path) ?? null;
      }

      const mail = renderEmail(t, c!, { sendId: row.id, footerAddress });
      const res = await sendMail({
        to: c!.email,
        ...mail,
        replyTo: process.env.EMAIL_REPLY_TO || SITE.emailService,
        attachments: file ? [{ filename: t.attachment_name || 'proposal.pdf', content: file }] : undefined,
      });
      if (res.ok) {
        const sentAt = new Date();
        await finish({ status: 'sent', sent_at: sentAt.toISOString(), error: null });
        stats.sent++;
        if (row.step === 0) {
          // Time follow-ups from when the first email actually went out.
          const { data: fus } = await db.from('email_sends').select('id,delay_days').eq('campaign_id', row.campaign_id).eq('contact_id', row.contact_id).gt('step', 0).eq('status', 'queued');
          for (const f of fus ?? []) {
            await db.from('email_sends').update({ send_after: new Date(sentAt.getTime() + f.delay_days * 86400000).toISOString() }).eq('id', f.id);
          }
        }
      } else {
        // Retry later up to 3 attempts, then give up.
        const { data: cur } = await db.from('email_sends').select('attempts').eq('id', row.id).single();
        const retry = (cur?.attempts ?? 3) < 3;
        await finish(retry ? { status: 'queued', send_after: new Date(Date.now() + 10 * 60000).toISOString(), error: res.error } : { status: 'failed', error: res.error });
        stats.failed++;
      }
    }
  }

  // Close campaigns that have nothing left to send.
  for (const id of touched) {
    const { count } = await db.from('email_sends').select('id', { count: 'exact', head: true }).eq('campaign_id', id).in('status', ['queued', 'sending']);
    if (!count) await db.from('campaigns').update({ status: 'sent' }).eq('id', id).eq('status', 'sending');
  }
  const { count: due } = await db.from('email_sends').select('id', { count: 'exact', head: true }).eq('status', 'queued').lte('send_after', new Date().toISOString());
  return { ...stats, due: due ?? 0 };
}

/** Adds or refreshes a contact without ever re-subscribing someone who opted out. */
export async function upsertContact(
  db: SupabaseClient,
  c: { email: string; name?: string | null; company?: string | null; phone?: string | null; source: Contact['source']; tags?: string[]; lead_id?: string | null },
) {
  const email = c.email.trim().toLowerCase();
  const { data: existing } = await db.from('contacts').select('id,tags,name,company,phone').eq('email', email).maybeSingle();
  if (existing) {
    const tags = Array.from(new Set([...(existing.tags ?? []), ...(c.tags ?? [])]));
    await db
      .from('contacts')
      .update({
        tags,
        name: existing.name || c.name || null,
        company: existing.company || c.company || null,
        phone: existing.phone || c.phone || null,
        ...(c.lead_id ? { lead_id: c.lead_id } : {}),
      })
      .eq('id', existing.id);
    return existing.id as string;
  }
  const { data, error } = await db
    .from('contacts')
    .insert({ email, name: c.name || null, company: c.company || null, phone: c.phone || null, source: c.source, tags: c.tags ?? [], lead_id: c.lead_id ?? null })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  return data.id as string;
}
