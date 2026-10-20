import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';

/**
 * One way out for every email, on two channels:
 * - "service": lead alerts and customer confirmations (EMAIL_FROM, default service@)
 * - "marketing": proposals, follow-ups and newsletter mail (MARKETING_FROM, default info@)
 *
 * Both use SMTP when SMTP_HOST is set. Marketing can log in with its own mailbox
 * (MARKETING_SMTP_USER / MARKETING_SMTP_PASS); otherwise it uses the main SMTP
 * login, which with Gmail requires info@ to be a "Send mail as" address of that
 * account. Falls back to Resend's HTTP API when only RESEND_API_KEY is set.
 */
export type Channel = 'service' | 'marketing';

export const FROM = process.env.EMAIL_FROM || 'Diesel Dynamix <service@dieseldynamix.com>';
export const MARKETING_FROM = process.env.MARKETING_FROM || 'Diesel Dynamix <info@dieseldynamix.com>';

/** Bare address from "Name <addr>" (used as the reply-to for marketing mail). */
export function addressOf(from: string) {
  return from.match(/<([^>]+)>/)?.[1] ?? from;
}

export type Mail = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  headers?: Record<string, string>;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
  channel?: Channel;
};

const transports: Partial<Record<Channel, Transporter>> = {};

function smtp(channel: Channel) {
  if (!process.env.SMTP_HOST) return null;
  if (!transports[channel]) {
    const port = Number(process.env.SMTP_PORT || 587);
    const ownLogin = channel === 'marketing' && process.env.MARKETING_SMTP_USER && process.env.MARKETING_SMTP_PASS;
    const user = ownLogin ? process.env.MARKETING_SMTP_USER : process.env.SMTP_USER;
    const pass = ownLogin ? process.env.MARKETING_SMTP_PASS : process.env.SMTP_PASS;
    transports[channel] = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
      auth: user ? { user, pass } : undefined,
      pool: true,
      maxConnections: 2,
    });
  }
  return transports[channel]!;
}

export function mailConfigured() {
  return Boolean((process.env.SMTP_HOST && process.env.SMTP_PASS) || process.env.RESEND_API_KEY);
}

export async function sendMail({ channel = 'service', ...m }: Mail): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const from = channel === 'marketing' ? MARKETING_FROM : FROM;
  const t = smtp(channel);
  if (t) {
    try {
      await t.sendMail({ from, ...m });
      return { ok: true };
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      console.error(`[mail] smtp (${channel}) failed`, error);
      return { ok: false, error };
    }
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn('[mail] no SMTP_HOST or RESEND_API_KEY; skipped:', m.subject);
    return { ok: false, skipped: true, error: 'Email is not configured' };
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: m.to,
      subject: m.subject,
      html: m.html,
      text: m.text,
      reply_to: m.replyTo,
      headers: m.headers,
      attachments: m.attachments?.map((a) => ({ filename: a.filename, content: a.content.toString('base64') })),
    }),
  });
  if (!res.ok) {
    const error = `${res.status} ${await res.text().catch(() => '')}`.slice(0, 500);
    console.error('[mail] resend failed', error);
    return { ok: false, error };
  }
  return { ok: true };
}
