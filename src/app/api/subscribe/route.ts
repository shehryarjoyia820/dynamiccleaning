import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { renderEmail, upsertContact, type Contact } from '@/lib/campaigns';
import { mailConfigured, sendMail } from '@/lib/mailer';
import { clientIpHash, limited } from '@/lib/rate-limit';
import { SITE } from '@/lib/site';
import { serviceClient } from '@/lib/supabase/clients';

export const runtime = 'nodejs';

const schema = z.object({
  email: z.string({ required_error: 'Enter your email' }).trim().max(160).email('Enter a valid email'),
  name: z.string().trim().max(120).optional(),
  website: z.string().max(0).optional(),
});

const WELCOME = {
  subject: 'You’re subscribed to Diesel Dynamix updates',
  body: `Hi {{first_name}},

Thanks for subscribing. We’ll send occasional Clean Truck Check updates: deadline reminders, rule changes and practical tips for California truck owners and fleets. No spam.

Need testing now? Call or WhatsApp **${SITE.phoneDisplay}** or reply to this email.

Diesel Dynamix`,
};

export async function POST(req: NextRequest) {
  const { ipHash } = clientIpHash(req);
  if (limited(`sub:${ipHash}`)) return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 });

  const raw = await req.json().catch(() => null);
  if (raw?.website) return NextResponse.json({ ok: true });
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid email' }, { status: 422 });

  const db = serviceClient();
  if (!db) return NextResponse.json({ error: 'Subscriptions are not available yet. Please try again soon.' }, { status: 503 });

  const id = await upsertContact(db, { email: parsed.data.email, name: parsed.data.name, source: 'subscriber', tags: ['newsletter'] });
  // Subscribing is an explicit opt-in, so it re-activates a contact who unsubscribed before.
  const { data: contact } = await db
    .from('contacts')
    .update({ status: 'subscribed', unsubscribed_at: null })
    .eq('id', id)
    .select('*')
    .single();

  if (contact && mailConfigured()) {
    const { data: footer } = await db.from('site_settings').select('value').eq('key', 'email_footer_address').maybeSingle();
    const mail = renderEmail(WELCOME, contact as Contact, { footerAddress: typeof footer?.value === 'string' ? footer.value : '' });
    await sendMail({ to: (contact as Contact).email, ...mail });
  }
  return NextResponse.json({ ok: true });
}
