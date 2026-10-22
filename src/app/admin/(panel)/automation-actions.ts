'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireStaff, userError } from '@/lib/admin';
import { DEFAULT_TIERS, runAutomations, zipsFor, type Tier } from '@/lib/automation';
import { ensureScheduler, stopScheduler } from '@/lib/scheduler';
import { serviceClient } from '@/lib/supabase/clients';

const get = (f: FormData, k: string) => String(f.get(k) ?? '').trim();
const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use a time like 19:00');

function svc() {
  const db = serviceClient();
  if (!db) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  return db;
}

function parseTiers(form: FormData): Tier[] {
  const days = Math.min(30, Math.max(1, parseInt(get(form, 'follow_up_days'), 10) || 3));
  return DEFAULT_TIERS.map((d) => {
    const p = d.priority;
    const start = hhmm.parse(get(form, `start_${p}`) || d.start);
    const end = hhmm.parse(get(form, `end_${p}`) || d.end);
    if (end <= start) throw new Error(`Priority ${p}: the window must end after it starts (same day).`);
    return {
      priority: p,
      enabled: form.get(`enabled_${p}`) === 'on',
      start,
      end,
      daily: Math.min(500, Math.max(0, parseInt(get(form, `daily_${p}`), 10) || 0)),
      proposal: z.string().uuid().parse(get(form, `proposal_${p}`)),
      follow_up: get(form, `follow_up_${p}`) || null,
      follow_up_days: days,
    };
  });
}

async function footerAddressSet() {
  const { data } = await svc().from('site_settings').select('value').eq('key', 'email_footer_address').maybeSingle();
  return typeof data?.value === 'string' && data.value.trim().length >= 10;
}

/** Creates (or updates) an automation. A new one gets its own campaign for the record and starts right away. */
export async function saveAutomation(form: FormData) {
  const { db, user } = await requireStaff();
  let tiers: Tier[];
  try {
    tiers = parseTiers(form);
  } catch (e) {
    return userError(e instanceof z.ZodError ? e.issues[0].message : (e as Error).message);
  }
  if (!tiers.some((t) => t.enabled && t.daily > 0)) return userError('Turn on at least one priority with a daily number above 0.');
  const lists = form.getAll('lists').map(String).filter(Boolean).slice(0, 20);
  const name = get(form, 'name').slice(0, 120) || `Automation · ${lists.join(' + ') || 'All lists'}`;
  const priority_cities = [...new Set(get(form, 'priority_cities').split(',').map((c) => c.trim().replace(/\s+/g, ' ')).filter(Boolean))].slice(0, 30);
  const only_cities = [...new Set(get(form, 'only_cities').split(',').map((c) => c.trim().replace(/\s+/g, ' ')).filter(Boolean))].slice(0, 30);
  const only_zips = [...new Set([...zipsFor(only_cities), ...get(form, 'only_zips').split(/[\s,]+/).filter((z) => /^\d{5}$/.test(z))])];
  const priority_zips = [
    ...new Set([...zipsFor(priority_cities), ...get(form, 'priority_zips').split(/[\s,]+/).filter((z) => /^\d{5}$/.test(z))]),
  ];
  const id = get(form, 'id');

  if (id) {
    const { error } = await db.from('automations').update({ name, lists, tiers, priority_cities, priority_zips, only_cities, only_zips }).eq('id', id);
    if (error) return userError(error.message);
    revalidatePath('/admin/automation');
    redirect('/admin/automation');
  }

  if (!(await footerAddressSet())) return userError('Add your postal address under Settings → Email footer address first (required by US law).');

  const first = tiers.find((t) => t.enabled)!;
  const { data: camp, error: ce } = await db
    .from('campaigns')
    .insert({
      name,
      template_id: first.proposal,
      audience: { type: 'automation', lists },
      // Lets the campaign page show the follow-up step; each follow-up row carries its own template.
      followups: tiers.some((t) => t.follow_up) ? [{ template_id: tiers.find((t) => t.follow_up)!.follow_up, delay_days: first.follow_up_days }] : [],
      status: 'sending',
      started_at: new Date().toISOString(),
      automation: true,
      created_by: user.id,
    })
    .select('id')
    .single();
  if (ce) return userError(ce.message);
  const { error } = await db.from('automations').insert({ name, lists, tiers, priority_cities, priority_zips, only_cities, only_zips, campaign_id: camp.id, created_by: user.id });
  if (error) return userError(error.message);

  const sched = await ensureScheduler();
  revalidatePath('/admin/automation');
  revalidatePath('/admin/emails/campaigns');
  if (!sched.ok) return userError(`Automation saved, but the background scheduler could not start: ${sched.error}`);
  redirect('/admin/automation');
}

export async function stopAutomation(id: string) {
  const { db } = await requireStaff();
  const { data } = await db.from('automations').update({ status: 'stopped', stopped_at: new Date().toISOString() }).eq('id', id).select('campaign_id').single();
  // Pausing the campaign also holds any follow-ups still waiting.
  if (data?.campaign_id) await db.from('campaigns').update({ status: 'paused' }).eq('id', data.campaign_id);
  const { count } = await db.from('automations').select('id', { count: 'exact', head: true }).eq('status', 'running');
  if (!count) await stopScheduler();
  revalidatePath('/admin/automation');
}

export async function resumeAutomation(id: string) {
  const { db } = await requireStaff();
  const { data } = await db.from('automations').update({ status: 'running', stopped_at: null }).eq('id', id).select('campaign_id').single();
  if (data?.campaign_id) await db.from('campaigns').update({ status: 'sending' }).eq('id', data.campaign_id);
  const sched = await ensureScheduler();
  revalidatePath('/admin/automation');
  if (!sched.ok) return userError(`Resumed, but the background scheduler could not start: ${sched.error}`);
}

/** Runs one scheduler tick now (only priorities whose window is open will queue new emails). */
export async function runAutomationNow() {
  await requireStaff();
  await runAutomations(svc(), { maxMs: 20000 });
  revalidatePath('/admin/automation');
}

/** Re-creates the background schedule (e.g. after changing CRON_SECRET). */
export async function repairScheduler() {
  await requireStaff();
  const sched = await ensureScheduler();
  revalidatePath('/admin/automation');
  if (!sched.ok) return userError(`Scheduler could not start: ${sched.error}`);
}
