import 'server-only';
import { redirect } from 'next/navigation';
import { sessionClient, supabaseConfigured } from '@/lib/supabase/clients';

export const LEAD_STATUSES = ['new', 'contacted', 'scheduled', 'completed', 'closed'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const ENGINE_LABELS: Record<string, string> = {
  obd: 'OBD',
  non_obd: 'Non-OBD',
  mixed: 'Mixed fleet',
  not_sure: 'Not sure',
};

export type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  kind: 'booking' | 'contact';
  status: LeadStatus;
  full_name: string;
  company: string | null;
  phone: string | null;
  email: string;
  trucks: number | null;
  location: string | null;
  engine_type: string | null;
  preferred_date: string | null;
  notes: string | null;
  message: string | null;
  source_page: string | null;
  assigned_to: string | null;
  appointment_at: string | null;
};

// Appointment times are entered and shown in California time regardless of server time zone.
const TZ = 'America/Los_Angeles';

function laParts(d: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(d);
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  return { y: p.year, m: p.month, d: p.day, h: p.hour, min: p.minute, s: p.second };
}

/** ISO timestamp -> "YYYY-MM-DDTHH:mm" in LA time, for <input type="datetime-local">. */
export function toLaInput(iso: string | null) {
  if (!iso) return '';
  const p = laParts(new Date(iso));
  return `${p.y}-${p.m}-${p.d}T${p.h}:${p.min}`;
}

/** "YYYY-MM-DDTHH:mm" entered as LA wall-clock time -> ISO timestamp. */
export function fromLaInput(value: string) {
  const guess = Date.parse(`${value}:00Z`);
  if (Number.isNaN(guess)) return null;
  const p = laParts(new Date(guess));
  const wall = Date.UTC(+p.y, +p.m - 1, +p.d, +p.h, +p.min, +p.s);
  return new Date(guess - (wall - guess)).toISOString();
}

/**
 * Guard for every admin page and action: signed in, completed 2FA (AAL2),
 * and listed in public.profiles. Returns a session-bound client.
 */
export async function requireStaff(opts: { admin?: boolean } = {}) {
  if (!supabaseConfigured()) redirect('/admin/setup');
  const db = await sessionClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect('/admin/login');

  const { data: aal } = await db.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.currentLevel !== 'aal2') redirect('/admin/mfa');

  const { data: profile } = await db.from('profiles').select('id,full_name,role').eq('id', user.id).maybeSingle();
  if (!profile) redirect('/admin/login?error=not-staff');
  if (opts.admin && profile.role !== 'admin') redirect('/admin');

  return { db, user, profile: profile as { id: string; full_name: string; role: 'admin' | 'staff' } };
}
