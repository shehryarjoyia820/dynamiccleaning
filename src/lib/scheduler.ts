import 'server-only';
import { withClient } from '@/lib/db-init';
import { TICK_MINUTES } from '@/lib/automation';
import { SITE } from '@/lib/site';

const JOB = 'dd-automation';

const lit = (s: string) => `'${s.replace(/'/g, "''")}'`;

/**
 * Makes Supabase call /api/cron/automation every few minutes (pg_cron + pg_net), so
 * automations keep running when nobody has the dashboard open. Safe to call repeatedly.
 */
export async function ensureScheduler(): Promise<{ ok: boolean; error?: string }> {
  const secret = process.env.CRON_SECRET;
  if (!secret) return { ok: false, error: 'CRON_SECRET is not set in Vercel → Settings → Environment Variables.' };
  const url = `${SITE.url}/api/cron/automation`;
  const command = `select net.http_get(url := ${lit(url)}, headers := jsonb_build_object('Authorization', ${lit(`Bearer ${secret}`)}), timeout_milliseconds := 60000)`;
  try {
    await withClient(async (c) => {
      await c.query('create extension if not exists pg_net');
      await c.query('create extension if not exists pg_cron');
      await c.query('select cron.schedule($1, $2, $3)', [JOB, `*/${TICK_MINUTES} * * * *`, command]);
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/** Removes the job once no automation is running (saves function calls). */
export async function stopScheduler() {
  try {
    await withClient((c) => c.query(`select cron.unschedule(jobid) from cron.job where jobname = $1`, [JOB]));
  } catch {
    // Not scheduled: nothing to stop.
  }
}

/** Whether the job exists and how its last few runs went. */
export async function schedulerStatus(): Promise<{ active: boolean; lastRun?: string; lastStatus?: string; error?: string }> {
  try {
    return await withClient(async (c) => {
      const job = await c.query(`select jobid, active from cron.job where jobname = $1`, [JOB]);
      if (!job.rows.length) return { active: false };
      const run = await c.query(`select status, end_time from cron.job_run_details where jobid = $1 order by start_time desc limit 1`, [job.rows[0].jobid]);
      return { active: !!job.rows[0].active, lastRun: run.rows[0]?.end_time?.toISOString?.(), lastStatus: run.rows[0]?.status };
    });
  } catch (e) {
    return { active: false, error: e instanceof Error ? e.message : String(e) };
  }
}
