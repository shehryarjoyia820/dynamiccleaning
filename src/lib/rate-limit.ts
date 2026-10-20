import 'server-only';
import { createHash } from 'node:crypto';
import type { NextRequest } from 'next/server';

export const RATE_WINDOW = 10 * 60 * 1000;
export const RATE_LIMIT = 5;

// Per-instance limiter; routes back it with a database check where they store rows.
const hits = new Map<string, number[]>();

export function clientIpHash(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  return { ip, ipHash: createHash('sha256').update(ip + (process.env.IP_HASH_SALT ?? 'dd')).digest('hex').slice(0, 32) };
}

export function limited(key: string, limit = RATE_LIMIT) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return list.length > limit;
}

/** Cloudflare Turnstile check; passes when Turnstile is not configured. */
export async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const json = (await res.json().catch(() => ({}))) as { success?: boolean };
  return json.success === true;
}
