import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { esc, shell } from '@/lib/email';
import { MARKETING_FROM, addressOf, mailConfigured, sendMail } from '@/lib/mailer';
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
  priority?: number;
  trucks?: number | null;
  list_name?: string;
};

/** Priority by fleet size: 1 = one truck, 2 = up to 3, 3 = up to 10, 4 = more than 10. */
export function truckPriority(trucks: number | null | undefined) {
  const n = Number(trucks) || 0;
  return n <= 1 ? 1 : n <= 3 ? 2 : n <= 10 ? 3 : 4;
}

export const PRIORITIES = [
  { value: 1, label: 'Priority 1', hint: '1 truck' },
  { value: 2, label: 'Priority 2', hint: '2–3 trucks' },
  { value: 3, label: 'Priority 3', hint: '4–10 trucks' },
  { value: 4, label: 'Priority 4', hint: '11+ trucks' },
] as const;

/** Starter proposal and follow-up for each priority (migration 0008). */
export const PRIORITY_TEMPLATES: Record<number, { proposal: string; followUp: string }> = {
  1: { proposal: '6f1b2a10-0000-4000-8000-000000000101', followUp: '6f1b2a10-0000-4000-8000-000000000201' },
  2: { proposal: '6f1b2a10-0000-4000-8000-000000000102', followUp: '6f1b2a10-0000-4000-8000-000000000202' },
  3: { proposal: '6f1b2a10-0000-4000-8000-000000000103', followUp: '6f1b2a10-0000-4000-8000-000000000203' },
  4: { proposal: '6f1b2a10-0000-4000-8000-000000000104', followUp: '6f1b2a10-0000-4000-8000-000000000204' },
};

/** ZIP codes for priority cities, so misspelled city names in imported lists still match. */
export const CITY_ZIPS: Record<string, string[]> = {
  ontario: ['91758', '91761', '91762', '91764'],
  fontana: ['92334', '92335', '92336', '92337'],
  'rancho cucamonga': ['91701', '91729', '91730', '91737', '91739'],
  rialto: ['92376', '92377'],
  'san bernardino': ['92401', '92404', '92405', '92407', '92408', '92410', '92411'],
  riverside: ['92501', '92503', '92504', '92505', '92506', '92507', '92508'],
  'long beach': ['90802', '90803', '90804', '90805', '90806', '90807', '90810', '90813', '90814', '90815'],
  'el centro': ['92243'],
};

const ZIP_CITY = new Map(Object.entries(CITY_ZIPS).flatMap(([city, zips]) => zips.map((z) => [z, city.replace(/\b\w/g, (x) => x.toUpperCase())] as const)));

/** Clean city for a contact: from the ZIP when known (lists misspell names), else the City column. */
export function contactCity(details: Record<string, string> | null | undefined) {
  const d = details ?? {};
  const zip = String(d.ZIP ?? d.Zip ?? d.zip ?? '').slice(0, 5);
  const named = String(d.City ?? d.city ?? '').trim().toLowerCase().replace(/\b\w/g, (x) => x.toUpperCase());
  return ZIP_CITY.get(zip) ?? (named || null);
}

/** List that website signups and form leads belong to. */
export const WEBSITE_LIST = 'Website';

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
  | { type: 'contacts'; ids: string[] }
  /** Up to `limit` contacts from each chosen priority, optionally only those never emailed before. */
  | { type: 'priority'; lists: string[]; picks: { priority: number; limit: number }[]; skipEmailed: boolean };

export type Followup = { template_id: string; delay_days: number };

export const MERGE_TAGS = ['{{first_name}}', '{{name}}', '{{company}}', '{{email}}', '{{book_button}}'];

/** Tag used for contacts staff mark as interested. */
export const INTERESTED_TAG = 'interested';

// Leads that reached these statuses have converted, so follow-ups stop.
const CONVERTED = ['scheduled', 'completed', 'closed'];

// ------------------------------------------------------------------ rendering

function inlineMd(s: string) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|tel:[^\s)]+)\)/g, '<a href="$2" style="color:#1D4ED8">$1</a>');
}

/** Minimal Markdown → email-safe HTML. Text is escaped before any markup is added. */
// Email-safe (table-based) call-to-action button, placed with {{book_button}}.
// The WhatsApp button was retired at the owner's request: the booking page covers it, so the tag renders nothing.
export const BOOK_URL = () => `${SITE.url}/book?utm_source=email&utm_medium=proposal`;
function emailButton(href: string, label: string, bg: string) {
  return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:20px 0"><tr><td style="border-radius:8px;background:${bg}"><a href="${href}" style="display:inline-block;padding:14px 26px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:8px">${label}</a></td></tr></table>`;
}
const BUTTONS: Record<string, () => string> = {
  '{{book_button}}': () => emailButton(BOOK_URL(), 'Schedule Your Booking &rarr;', '#1F5FE0'),
  '{{whatsapp_button}}': () => '',
};

/**
 * Puts the Book button after the first paragraph and the WhatsApp button at
 * the end, unless the template already places them with merge tags.
 */
export function withDefaultButtons(md: string) {
  if (md.includes('{{book_button}}')) return md;
  const blocks = md.replace(/\r\n/g, '\n').split(/\n{2,}/);
  const firstPara = blocks.findIndex((b, i) => i > 0 && b.trim() && !b.trim().startsWith('## '));
  blocks.splice(firstPara > 0 ? firstPara + 1 : Math.min(1, blocks.length), 0, '{{book_button}}');
  return blocks.join('\n\n');
}

export function markdownToHtml(md: string) {
  return md
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((block) => {
      const b = esc(block.trim());
      if (!b) return '';
      if (BUTTONS[b]) return BUTTONS[b]();
      if (b === '---') return '<hr style="border:0;border-top:1px solid #E5E7EB;margin:24px 0">';
      if (b.startsWith('### ')) return `<h3 style="font-size:16px;margin:20px 0 6px;color:#0F172A">${inlineMd(b.slice(4))}</h3>`;
      if (b.startsWith('## ')) return `<h2 style="font-size:20px;margin:24px 0 8px">${inlineMd(b.slice(3))}</h2>`;
      const lines = b.split('\n');
      if (lines.every((l) => /^[-*] /.test(l)))
        return `<ul style="padding-left:20px;margin:12px 0">${lines.map((l) => `<li style="margin:4px 0">${inlineMd(l.slice(2))}</li>`).join('')}</ul>`;
      if (lines.every((l) => /^\d+\. /.test(l)))
        return `<ol style="padding-left:20px;margin:12px 0">${lines.map((l) => `<li style="margin:6px 0">${inlineMd(l.replace(/^\d+\. /, ''))}</li>`).join('')}</ol>`;
      // "> " lines: a highlighted note box.
      if (lines.every((l) => l.startsWith('&gt; ')))
        return `<div style="margin:16px 0;padding:14px 16px;background:#EEF4FF;border-left:4px solid #4C8DFF;border-radius:6px;line-height:1.6">${lines.map((l) => inlineMd(l.slice(5))).join('<br>')}</div>`;
      return `<p style="margin:12px 0;line-height:1.6">${lines.map(inlineMd).join('<br>')}</p>`;
    })
    .join('');
}

export function applyMergeTags(text: string, c: Pick<Contact, 'email' | 'name' | 'company'>) {
  // Imported officer names look like "R. THOMAS JACQUES": skip initials and fix all-caps.
  const word = (c.name ?? '').trim().split(/\s+/).find((w) => w.replace(/[^a-z]/gi, '').length > 1) ?? '';
  const clean = word.replace(/[^a-z'-]/gi, '');
  const first = clean ? (clean === clean.toUpperCase() ? clean[0] + clean.slice(1).toLowerCase() : clean) : 'there';
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
  const bodyMd = withDefaultButtons(applyMergeTags(t.body, c));
  const urls = unsubscribeUrls(c.id);
  const footer = `${opts.footerAddress ? `${esc(opts.footerAddress)}<br>` : ''}You are receiving this because you contacted or subscribed to Diesel Dynamix.
    <a href="${urls.page}" style="color:#4A5160">Unsubscribe</a><br>`;
  const pixel = opts.sendId ? `<img src="${SITE.url}/api/t/${opts.sendId}" width="1" height="1" alt="" style="display:block;border:0">` : '';
  const html = shell(markdownToHtml(bodyMd) + pixel, footer);
  const text = `${bodyMd
    .replace(/\*\*/g, '')
    .replace('{{book_button}}', `Schedule your booking: ${BOOK_URL()}`)
    .replace('{{whatsapp_button}}', '')}\n\n--\n${opts.footerAddress}\nUnsubscribe: ${urls.page}`;
  return {
    subject,
    html,
    text,
    headers: {
      'List-Unsubscribe': `<${urls.oneClick}>, <mailto:${addressOf(MARKETING_FROM)}?subject=unsubscribe>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  };
}

// ------------------------------------------------------------------ audience

export async function resolveAudience(db: SupabaseClient, a: Audience) {
  const out: Contact[] = [];
  if (a.type === 'priority') {
    for (const p of a.picks) {
      const { data, error } = await db.rpc('pick_priority_contacts', {
        p_priority: p.priority,
        p_limit: p.limit,
        p_lists: a.lists,
        p_skip_emailed: a.skipEmailed,
      });
      if (error) throw new Error(error.message);
      out.push(...((data ?? []) as Contact[]));
    }
    return out;
  }
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
  const rows = recipients.flatMap((r) => {
    // A copy of who it went to, so the history stays readable if the contact is deleted later.
    const who = { recipient_email: r.email, recipient_name: r.name ?? null, recipient_city: contactCity((r as { details?: Record<string, string> }).details) };
    return [
    { campaign_id: c.id, contact_id: r.id, ...who, template_id: c.template_id, step: 0, delay_days: 0, send_after: new Date(now).toISOString() },
    ...followups.map((f, i) => ({
      campaign_id: c.id,
      contact_id: r.id,
      ...who,
      template_id: f.template_id,
      step: i + 1,
      delay_days: f.delay_days,
      send_after: new Date(now + f.delay_days * 86400000).toISOString(),
    })),
    ];
  });
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
  // Who was emailed in this run, for the live feed on the campaign page.
  const feed: { email: string; status: 'sent' | 'failed' | 'skipped'; step: number; at: string }[] = [];
  const log = (email: string | undefined, status: 'sent' | 'failed' | 'skipped', step: number) => {
    if (email) feed.push({ email, status, step, at: new Date().toISOString() });
  };
  if (!mailConfigured()) return { ...stats, notConfigured: true, due: 0, feed };

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
        log(c?.email, 'skipped', row.step);
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
        channel: 'marketing',
        replyTo: process.env.EMAIL_REPLY_TO || addressOf(MARKETING_FROM),
        attachments: file ? [{ filename: t.attachment_name || 'proposal.pdf', content: file }] : undefined,
      });
      if (res.ok) {
        const sentAt = new Date();
        await finish({ status: 'sent', sent_at: sentAt.toISOString(), error: null });
        stats.sent++;
        log(c!.email, 'sent', row.step);
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
        log(c!.email, 'failed', row.step);
      }
    }
  }

  // Close campaigns that have nothing left to send.
  for (const id of touched) {
    const { count } = await db.from('email_sends').select('id', { count: 'exact', head: true }).eq('campaign_id', id).in('status', ['queued', 'sending']);
    // Automation campaigns stay open: they keep getting new emails every day.
    if (!count) await db.from('campaigns').update({ status: 'sent' }).eq('id', id).eq('status', 'sending').eq('automation', false);
  }
  const { count: due } = await db.from('email_sends').select('id', { count: 'exact', head: true }).eq('status', 'queued').lte('send_after', new Date().toISOString());
  return { ...stats, due: due ?? 0, feed };
}

/** Adds or refreshes a contact without ever re-subscribing someone who opted out. */
export async function upsertContact(
  db: SupabaseClient,
  c: {
    email: string;
    name?: string | null;
    company?: string | null;
    phone?: string | null;
    source: Contact['source'];
    tags?: string[];
    lead_id?: string | null;
    /** Fleet size from a booking form; sets the contact's priority. */
    trucks?: number | null;
  },
) {
  const email = c.email.trim().toLowerCase();
  const { data: existing } = await db.from('contacts').select('id,tags,name,company,phone,trucks').eq('email', email).maybeSingle();
  if (existing) {
    const tags = Array.from(new Set([...(existing.tags ?? []), ...(c.tags ?? [])]));
    const trucks = c.trucks ? Math.max(c.trucks, existing.trucks ?? 0) : existing.trucks;
    await db
      .from('contacts')
      .update({
        tags,
        name: existing.name || c.name || null,
        company: existing.company || c.company || null,
        phone: existing.phone || c.phone || null,
        ...(c.lead_id ? { lead_id: c.lead_id } : {}),
        ...(c.trucks ? { trucks, priority: truckPriority(trucks) } : {}),
      })
      .eq('id', existing.id);
    return existing.id as string;
  }
  const base = { email, name: c.name || null, company: c.company || null, phone: c.phone || null, source: c.source, tags: c.tags ?? [], lead_id: c.lead_id ?? null };
  const insert = (row: Record<string, unknown>) => db.from('contacts').insert(row).select('id').single();
  let { data, error } = await insert({ ...base, list_name: WEBSITE_LIST, trucks: c.trucks ?? null, priority: truckPriority(c.trucks) });
  // Until the priority upgrade has run on this database, store the contact without those columns.
  if (error && /list_name|priority|trucks/.test(error.message)) ({ data, error } = await insert(base));
  if (error || !data) throw new Error(error?.message ?? 'Contact not saved');
  return data.id as string;
}
