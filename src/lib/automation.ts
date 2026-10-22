import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { INTERESTED_TAG, PRIORITY_TEMPLATES, processQueue } from '@/lib/campaigns';

export const TZ = 'America/Los_Angeles';
/** How often the scheduler calls /api/cron/automation (minutes). */
export const TICK_MINUTES = 10;

export type Tier = {
  priority: number;
  enabled: boolean;
  /** "HH:MM", California time */
  start: string;
  end: string;
  /** New contacts emailed per day */
  daily: number;
  proposal: string;
  follow_up: string | null;
  follow_up_days: number;
};

export type Automation = {
  id: string;
  name: string;
  lists: string[];
  tiers: Tier[];
  status: 'running' | 'stopped';
  campaign_id: string | null;
  /** Emailed first inside every priority (matched by city name or ZIP). */
  priority_cities?: string[];
  priority_zips?: string[];
  last_run_at: string | null;
  last_run: Record<string, unknown> | null;
  started_at: string;
  stopped_at: string | null;
  created_at: string;
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

export const DEFAULT_PRIORITY_CITIES = ['Ontario', 'Fontana', 'Rancho Cucamonga', 'Rialto'];

export const zipsFor = (cities: string[]) => [...new Set(cities.flatMap((c) => CITY_ZIPS[c.trim().toLowerCase()] ?? []))];

/** Default plan: priority, California window and daily emails. */
export const DEFAULT_TIERS: Tier[] = [
  { priority: 1, start: '19:00', end: '21:00', daily: 20 },
  { priority: 2, start: '06:00', end: '08:00', daily: 15 },
  { priority: 3, start: '14:00', end: '16:00', daily: 10 },
  { priority: 4, start: '09:00', end: '11:00', daily: 5 },
].map((t) => ({
  ...t,
  enabled: true,
  proposal: PRIORITY_TEMPLATES[t.priority].proposal,
  follow_up: PRIORITY_TEMPLATES[t.priority].followUp,
  follow_up_days: 3,
}));

// ------------------------------------------------------------------ California time helpers

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

/** Current date ("YYYY-MM-DD") and minute of the day in California. */
export function laNow(d = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      .formatToParts(d)
      .map((x) => [x.type, x.value]),
  );
  return { date: `${p.year}-${p.month}-${p.day}`, minutes: Number(p.hour) * 60 + Number(p.minute) };
}

/** UTC instant of a California wall-clock time (handles daylight saving). */
export function laToUtc(date: string, hhmm: string) {
  const [y, mo, d] = date.split('-').map(Number);
  const guess = Date.UTC(y, mo - 1, d, 0, toMin(hhmm));
  const offsetAt = (ms: number) => {
    const name = new Intl.DateTimeFormat('en-US', { timeZone: TZ, timeZoneName: 'shortOffset' }).formatToParts(new Date(ms)).find((x) => x.type === 'timeZoneName')?.value ?? 'GMT-8';
    const [, sign, hh, mm] = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/) ?? [, '-', '8', '0'];
    return (sign === '-' ? -1 : 1) * (Number(hh) * 60 + Number(mm || 0));
  };
  // Second pass uses the offset at the answer itself, so clock-change days come out right.
  const first = guess - offsetAt(guess) * 60000;
  return new Date(guess - offsetAt(first) * 60000);
}

export function addDays(date: string, n: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export const fmtWindow = (t: Pick<Tier, 'start' | 'end'>) => {
  const f = (s: string) => {
    const m = toMin(s);
    const h = Math.floor(m / 60);
    return `${h % 12 || 12}${m % 60 ? `:${String(m % 60).padStart(2, '0')}` : ''} ${h < 12 ? 'AM' : 'PM'}`;
  };
  return `${f(t.start)}–${f(t.end)} PT`;
};

export const inWindow = (t: Pick<Tier, 'start' | 'end'>, minutes: number) => minutes >= toMin(t.start) && minutes < toMin(t.end);

// ------------------------------------------------------------------ the engine

type TierRun = { priority: number; picked: number; reason?: string };

/**
 * One scheduler tick. For every running automation and every priority whose California
 * window is open now, queues that priority's share of today's emails (spread across the
 * window), tags repeat openers as Interested with a follow-up after N days, then sends
 * whatever is due.
 */
export async function runAutomations(db: SupabaseClient, opts: { maxMs?: number } = {}) {
  const started = Date.now();
  const { data } = await db.from('automations').select('*').eq('status', 'running');
  const autos = (data ?? []) as Automation[];
  const now = laNow();
  const runs: Record<string, unknown>[] = [];

  for (const a of autos) {
    if (!a.campaign_id) continue;
    const tiers: TierRun[] = [];

    for (const t of a.tiers.filter((x) => x.enabled && x.daily > 0)) {
      if (!inWindow(t, now.minutes)) {
        tiers.push({ priority: t.priority, picked: 0, reason: 'outside window' });
        continue;
      }
      const { count: today } = await db
        .from('email_sends')
        .select('id', { count: 'exact', head: true })
        .eq('campaign_id', a.campaign_id)
        .eq('priority', t.priority)
        .eq('step', 0)
        .gte('created_at', laToUtc(now.date, '00:00').toISOString());
      const remaining = t.daily - (today ?? 0);
      if (remaining <= 0) {
        tiers.push({ priority: t.priority, picked: 0, reason: 'daily limit reached' });
        continue;
      }
      // Spread the day's emails over the rest of the window instead of sending them all at once.
      const ticksLeft = Math.max(1, Math.ceil((toMin(t.end) - now.minutes) / TICK_MINUTES));
      const take = Math.ceil(remaining / ticksLeft);
      // Priority cities first, then biggest fleets.
      const base = { p_priority: t.priority, p_limit: take, p_lists: a.lists, p_skip_emailed: true };
      let { data: picks, error } = await db.rpc('pick_priority_contacts', { ...base, p_cities: a.priority_cities ?? [], p_zips: a.priority_zips ?? [] });
      // Database not upgraded yet: pick without the city preference rather than stall.
      if (error && /pick_priority_contacts/.test(error.message)) ({ data: picks, error } = await db.rpc('pick_priority_contacts', base));
      if (error) {
        tiers.push({ priority: t.priority, picked: 0, reason: error.message });
        continue;
      }
      const rows = ((picks ?? []) as { id: string; email: string; name: string | null }[]).map((c) => ({
        campaign_id: a.campaign_id,
        contact_id: c.id,
        recipient_email: c.email,
        recipient_name: c.name,
        template_id: t.proposal,
        step: 0,
        delay_days: 0,
        priority: t.priority,
        send_after: new Date().toISOString(),
      }));
      if (rows.length) await db.from('email_sends').upsert(rows, { onConflict: 'campaign_id,contact_id,step', ignoreDuplicates: true });
      tiers.push({ priority: t.priority, picked: rows.length, reason: rows.length ? undefined : 'no contacts left' });
    }

    const followUps = await handleRepeatOpeners(db, a, now.date);
    const summary = { at: new Date().toISOString(), la: now, tiers, followUps };
    runs.push({ id: a.id, ...summary });
    await db.from('automations').update({ last_run_at: summary.at, last_run: summary }).eq('id', a.id);
  }

  const sent = await processQueue(db, { maxMs: Math.max(5000, (opts.maxMs ?? 50000) - (Date.now() - started)) });
  return { automations: runs, sent };
}

/** Anyone who opened a proposal more than once: tag Interested and schedule the tier's follow-up. */
async function handleRepeatOpeners(db: SupabaseClient, a: Automation, today: string) {
  const { data: openers } = await db
    .from('email_sends')
    .select('contact_id,priority,recipient_email,recipient_name')
    .eq('campaign_id', a.campaign_id!)
    .eq('step', 0)
    .eq('status', 'sent')
    .gte('open_count', 2)
    .not('contact_id', 'is', null)
    .limit(500);
  if (!openers?.length) return 0;
  const ids = openers.map((o) => o.contact_id as string);
  const { data: existing } = await db.from('email_sends').select('contact_id').eq('campaign_id', a.campaign_id!).eq('step', 1).in('contact_id', ids);
  const done = new Set((existing ?? []).map((e) => e.contact_id));
  let added = 0;

  for (const o of openers) {
    if (done.has(o.contact_id)) continue;
    const { data: c } = await db.from('contacts').select('tags,status,replied_at').eq('id', o.contact_id).maybeSingle();
    if (!c) continue;
    const tags = (c.tags as string[]) ?? [];
    if (!tags.includes(INTERESTED_TAG)) await db.from('contacts').update({ tags: [...tags, INTERESTED_TAG] }).eq('id', o.contact_id);

    const t = a.tiers.find((x) => x.priority === o.priority);
    // Reply or unsubscribe stops follow-ups (the sender re-checks both just before sending).
    if (!t?.follow_up || c.status !== 'subscribed' || c.replied_at) continue;
    // N days later, at a random minute inside that priority's window.
    const span = Math.max(1, toMin(t.end) - toMin(t.start));
    const at = new Date(laToUtc(addDays(today, t.follow_up_days), t.start).getTime() + Math.floor(Math.random() * span) * 60000);
    const { error } = await db.from('email_sends').insert({
      campaign_id: a.campaign_id,
      contact_id: o.contact_id,
      recipient_email: o.recipient_email,
      recipient_name: o.recipient_name,
      template_id: t.follow_up,
      step: 1,
      delay_days: t.follow_up_days,
      priority: o.priority,
      send_after: at.toISOString(),
    });
    if (!error) added++;
  }
  return added;
}
