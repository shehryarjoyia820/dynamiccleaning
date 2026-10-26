import 'server-only';
import { sendMail } from '@/lib/mailer';
import { LINKS, SITE } from '@/lib/site';

export const SERVICE_INBOX = process.env.SERVICE_INBOX || SITE.emailService;

export function esc(s: unknown) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/** Transactional email (lead notifications, confirmations). */
export function sendEmail(opts: { to: string | string[]; subject: string; html: string; replyTo?: string }) {
  return sendMail(opts);
}

export function shell(inner: string, footer?: string) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#111318">
  <div style="background:#0B0F14;padding:18px 24px;border-bottom:4px solid #4C8DFF">
    <span style="color:#fff;font-weight:800;font-size:22px;letter-spacing:1px">DIESEL <span style="color:#4C8DFF">DYNAMIX</span></span>
  </div>
  <div style="padding:24px;background:#ffffff">${inner}</div>
  <div style="padding:16px 24px;background:#F4F6F9;font-size:12px;line-height:1.6;color:#4A5160">
    ${footer ?? ''}Diesel Dynamix is an independent service provider, not CARB or a California government website.
  </div></div>`;
}

export function leadTable(fields: [string, unknown][]) {
  return `<table cellpadding="8" style="border-collapse:collapse;width:100%;font-size:14px">${fields
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `<tr><td style="border-bottom:1px solid #eee;font-weight:bold;width:40%">${esc(k)}</td><td style="border-bottom:1px solid #eee">${esc(v).replace(/\n/g, '<br>')}</td></tr>`)
    .join('')}</table>`;
}

export function staffEmail(title: string, fields: [string, unknown][], adminUrl?: string) {
  return shell(`<h2 style="margin:0 0 16px">${esc(title)}</h2>${leadTable(fields)}${
    adminUrl ? `<p style="margin-top:20px"><a href="${esc(adminUrl)}" style="background:#4C8DFF;color:#111318;padding:12px 18px;text-decoration:none;font-weight:bold;border-radius:6px">Open in admin</a></p>` : ''
  }`);
}

export function customerConfirmation(name: string, kind: 'booking' | 'contact') {
  const what = kind === 'booking' ? 'your Clean Truck Check testing request' : 'your message';
  return shell(`<p>Hi ${esc(name)},</p>
  <p>Thanks for contacting Diesel Dynamix. We received ${what} and our team will reach out shortly${kind === 'booking' ? ' to confirm your appointment' : ''}.</p>
  <p>Need us sooner?</p>
  <p><strong>Call:</strong> <a href="${LINKS.tel}">${SITE.phoneDisplay}</a><br>
  <strong>WhatsApp:</strong> <a href="${LINKS.whatsapp}">${SITE.phoneDisplay}</a><br>
  <strong>Email:</strong> <a href="${LINKS.mailService}">${SITE.emailService}</a></p>
  <p>Diesel Dynamix<br>Mobile Clean Truck Check testing, anywhere in Southern California</p>`);
}

/** Optional SMS alert to the team via Twilio when TWILIO_* env vars are set. */
/** @deprecated use sendLeadAlert (SMS and/or WhatsApp). */
export async function sendTeamSms(body: string) {
  const { sendLeadAlert } = await import('@/lib/alerts');
  return sendLeadAlert(body);
}
