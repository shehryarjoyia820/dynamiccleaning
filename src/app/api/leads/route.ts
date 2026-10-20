import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { upsertContact } from '@/lib/campaigns';
import { mailConfigured } from '@/lib/mailer';
import { RATE_LIMIT, RATE_WINDOW, clientIpHash, limited, verifyTurnstile } from '@/lib/rate-limit';
import { serviceClient } from '@/lib/supabase/clients';
import { INFO_INBOX, SERVICE_INBOX, customerConfirmation, sendEmail, sendTeamSms, staffEmail } from '@/lib/email';
import { SITE } from '@/lib/site';

export const runtime = 'nodejs';

const ENGINE = { obd: 'OBD', non_obd: 'Non-OBD', mixed: 'Mixed fleet', not_sure: 'Not sure' } as const;

const str = (max: number) => z.string().trim().max(max);
const phone = z
  .string({ required_error: 'Enter a valid phone number' })
  .trim()
  .max(30)
  .refine((v) => v.replace(/\D/g, '').length >= 10, 'Enter a valid phone number');

const base = z.object({
  full_name: z.string({ required_error: 'Enter your name' }).trim().max(120).min(2, 'Enter your name'),
  email: z.string({ required_error: 'Enter a valid email' }).trim().max(160).email('Enter a valid email'),
  consent: z.literal('yes', { errorMap: () => ({ message: 'Please accept to continue' }) }),
  source_page: str(200).optional(),
  website: z.string().max(0).optional(), // honeypot must stay empty
  'cf-turnstile-response': z.string().optional(),
});

const booking = base.extend({
  kind: z.literal('booking'),
  company: str(160).optional(),
  phone,
  trucks: z.coerce.number({ invalid_type_error: 'Enter the number of trucks' }).int().min(1, 'At least 1 truck').max(5000),
  location: z.string({ required_error: 'Enter a city or ZIP' }).trim().max(120).min(2, 'Enter a city or ZIP'),
  engine_type: z.enum(['obd', 'non_obd', 'mixed', 'not_sure'], { errorMap: () => ({ message: 'Choose an engine type' }) }),
  preferred_date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal('')),
  notes: str(2000).optional(),
});

const contact = base.extend({
  kind: z.literal('contact'),
  phone: phone.optional().or(z.literal('')),
  message: z.string({ required_error: 'Enter a message' }).trim().max(4000).min(5, 'Enter a message'),
});

const schema = z.discriminatedUnion('kind', [booking, contact]);

export async function POST(req: NextRequest) {
  const { ip, ipHash } = clientIpHash(req);

  if (limited(ipHash)) {
    return NextResponse.json({ error: 'Too many requests. Please call or WhatsApp us instead.' }, { status: 429 });
  }

  const raw = await req.json().catch(() => null);
  if (!raw || typeof raw !== 'object') return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  // Bots fill the hidden field: pretend success, store nothing.
  if ((raw as Record<string, unknown>).website) return NextResponse.json({ ok: true });

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? 'form');
      fieldErrors[k] ??= issue.message;
    }
    return NextResponse.json({ error: 'Please fix the highlighted fields.', fieldErrors }, { status: 422 });
  }
  const d = parsed.data;

  if (!(await verifyTurnstile(d['cf-turnstile-response'], ip))) {
    return NextResponse.json({ error: 'Spam check failed. Please refresh and try again.' }, { status: 400 });
  }

  const db = serviceClient();
  if (!db && !mailConfigured()) {
    // Nowhere to deliver the lead: tell the visitor rather than silently dropping it.
    return NextResponse.json(
      { error: `Online booking is not available right now. Please call or WhatsApp ${SITE.phoneDisplay}.` },
      { status: 503 },
    );
  }
  let leadId: string | null = null;
  if (db) {
    const since = new Date(Date.now() - RATE_WINDOW).toISOString();
    const { count } = await db.from('leads').select('id', { count: 'exact', head: true }).eq('ip_hash', ipHash).gte('created_at', since);
    if ((count ?? 0) >= RATE_LIMIT) {
      return NextResponse.json({ error: 'Too many requests. Please call or WhatsApp us instead.' }, { status: 429 });
    }
    const row =
      d.kind === 'booking'
        ? {
            kind: d.kind,
            full_name: d.full_name,
            company: d.company || null,
            phone: d.phone,
            email: d.email,
            trucks: d.trucks,
            location: d.location,
            engine_type: d.engine_type,
            preferred_date: d.preferred_date || null,
            notes: d.notes || null,
            source_page: d.source_page ?? null,
            ip_hash: ipHash,
          }
        : {
            kind: d.kind,
            full_name: d.full_name,
            phone: d.phone || null,
            email: d.email,
            message: d.message,
            source_page: d.source_page ?? null,
            ip_hash: ipHash,
          };
    const { data, error } = await db.from('leads').insert(row).select('id').single();
    if (error) console.error('[leads] insert failed', error.message);
    leadId = data?.id ?? null;
    // Everyone who submits a form becomes a contact for proposals and follow-ups.
    try {
      await upsertContact(db, { email: d.email, name: d.full_name, company: d.kind === 'booking' ? d.company : null, phone: d.phone || null, source: 'lead', tags: [d.kind], lead_id: leadId });
    } catch (e) {
      console.error('[leads] contact upsert failed', e);
    }
  } else {
    console.warn('[leads] Supabase not configured; lead not stored');
  }

  const adminUrl = leadId ? `${SITE.url}/admin/leads/${leadId}` : undefined;
  const tasks: Promise<unknown>[] = [];

  if (d.kind === 'booking') {
    const fields: [string, unknown][] = [
      ['Name', d.full_name],
      ['Company', d.company],
      ['Phone', d.phone],
      ['Email', d.email],
      ['Trucks', d.trucks],
      ['Location', d.location],
      ['Engine type', ENGINE[d.engine_type]],
      ['Preferred date', d.preferred_date],
      ['Notes', d.notes],
      ['Submitted from', d.source_page],
    ];
    tasks.push(
      sendEmail({
        to: SERVICE_INBOX,
        subject: `New booking: ${d.full_name} · ${d.trucks} truck(s) · ${d.location}`,
        html: staffEmail('New booking request', fields, adminUrl),
        replyTo: d.email,
      }),
      sendTeamSms(`New Diesel Dynamix booking: ${d.full_name}, ${d.phone}, ${d.trucks} truck(s) in ${d.location}`),
    );
  } else {
    tasks.push(
      sendEmail({
        to: INFO_INBOX,
        subject: `New message from ${d.full_name}`,
        html: staffEmail('New contact message', [
          ['Name', d.full_name],
          ['Phone', d.phone],
          ['Email', d.email],
          ['Message', d.message],
        ], adminUrl),
        replyTo: d.email,
      }),
    );
  }
  tasks.push(
    sendEmail({
      to: d.email,
      subject: d.kind === 'booking' ? 'We received your Clean Truck Check request' : 'We received your message',
      html: customerConfirmation(d.full_name, d.kind),
      replyTo: d.kind === 'booking' ? SERVICE_INBOX : INFO_INBOX,
    }),
  );
  await Promise.allSettled(tasks);

  return NextResponse.json({ ok: true });
}
