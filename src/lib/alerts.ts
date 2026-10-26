import 'server-only';

/**
 * Instant phone alerts for new website leads, by text (SMS) and/or WhatsApp.
 * Each channel switches on when its settings exist in Vercel; with none set, nothing is sent.
 *
 * SMS (Twilio):            TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM, TEAM_ALERT_PHONE
 * WhatsApp (Twilio):       the same Twilio settings plus TWILIO_WHATSAPP_FROM (an approved WhatsApp sender)
 * WhatsApp (CallMeBot):    CALLMEBOT_WHATSAPP = "+18585550123:APIKEY" (comma-separate several phones)
 *
 * TEAM_ALERT_PHONE can list several numbers, comma separated (+18585550123,+19515550123).
 */

const list = (v?: string) => (v ?? '').split(',').map((s) => s.trim()).filter(Boolean);

async function twilio(from: string, to: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: { Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ From: from, To: to, Body: body.slice(0, 1500) }),
  });
  if (!res.ok) console.error('[alert] twilio failed', res.status, to.startsWith('whatsapp:') ? 'whatsapp' : 'sms');
}

async function callmebot(entry: string, body: string) {
  const i = entry.lastIndexOf(':');
  if (i < 1) return;
  const phone = entry.slice(0, i).trim();
  const key = entry.slice(i + 1).trim();
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&apikey=${encodeURIComponent(key)}&text=${encodeURIComponent(body.slice(0, 1500))}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) console.error('[alert] callmebot failed', res.status);
}

/** Sends `body` on every configured channel. Never throws: an alert must not break lead intake. */
export async function sendLeadAlert(body: string) {
  const jobs: Promise<unknown>[] = [];
  const hasTwilio = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN;
  const phones = list(process.env.TEAM_ALERT_PHONE);
  if (hasTwilio && process.env.TWILIO_FROM) for (const to of phones) jobs.push(twilio(process.env.TWILIO_FROM, to, body));
  if (hasTwilio && process.env.TWILIO_WHATSAPP_FROM) {
    const from = process.env.TWILIO_WHATSAPP_FROM.startsWith('whatsapp:') ? process.env.TWILIO_WHATSAPP_FROM : `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`;
    for (const to of phones) jobs.push(twilio(from, `whatsapp:${to}`, body));
  }
  for (const entry of list(process.env.CALLMEBOT_WHATSAPP)) jobs.push(callmebot(entry, body));
  const results = await Promise.allSettled(jobs);
  const failed = results.filter((r) => r.status === 'rejected').length;
  if (jobs.length) console.log(`[alert] lead alert: ${jobs.length - failed}/${jobs.length} sent`);
}

/** True when at least one alert channel is set up (shown in the admin). */
export function alertsConfigured() {
  const hasTwilio = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && list(process.env.TEAM_ALERT_PHONE).length);
  return {
    sms: hasTwilio && !!process.env.TWILIO_FROM,
    whatsapp: (hasTwilio && !!process.env.TWILIO_WHATSAPP_FROM) || list(process.env.CALLMEBOT_WHATSAPP).length > 0,
  };
}
