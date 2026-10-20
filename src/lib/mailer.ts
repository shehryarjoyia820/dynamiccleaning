import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';

/**
 * One way out for every email. Uses SMTP when SMTP_HOST is set,
 * otherwise Resend's HTTP API when RESEND_API_KEY is set.
 */
export const FROM = process.env.EMAIL_FROM || 'Diesel Dynamix <no-reply@dieseldynamix.com>';

export type Mail = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  headers?: Record<string, string>;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
};

let transport: Transporter | null = null;

function smtp() {
  if (!process.env.SMTP_HOST) return null;
  if (!transport) {
    const port = Number(process.env.SMTP_PORT || 587);
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
      pool: true,
      maxConnections: 2,
    });
  }
  return transport;
}

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST || process.env.RESEND_API_KEY);
}

export async function sendMail(m: Mail): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const t = smtp();
  if (t) {
    try {
      await t.sendMail({ from: FROM, ...m });
      return { ok: true };
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      console.error('[mail] smtp failed', error);
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
      from: FROM,
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
