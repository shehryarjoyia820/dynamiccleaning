import 'server-only';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Client } from 'pg';
import { serviceClient } from '@/lib/supabase/clients';

// Run in order. Every file is idempotent (create if not exists / on conflict do nothing).
const FILES = [
  'supabase/migrations/0001_init.sql',
  'supabase/migrations/0002_email.sql',
  'supabase/migrations/0003_no_mfa.sql',
  'supabase/migrations/0004_tracking.sql',
  'supabase/migrations/0005_blog_media.sql',
  'supabase/migrations/0006_campaign_history.sql',
  'supabase/migrations/0007_priority_lists.sql',
  'supabase/migrations/0008_priority_templates.sql',
  'supabase/migrations/0009_automation.sql',
  'supabase/migrations/0010_priority_cities.sql',
  'supabase/migrations/0011_recipient_city.sql',
  'supabase/seed.sql',
];

/**
 * Later migrations, each with a cheap probe that tells whether it is already
 * applied. Applied automatically by ensureSchema() so a live database picks up
 * new features without re-running the seed (which would restore deleted rows).
 */
const UPGRADES: { file: string; applied: () => Promise<boolean> }[] = [
  {
    file: 'supabase/migrations/0004_tracking.sql',
    applied: async () => {
      const db = serviceClient();
      if (!db) return true;
      const { error } = await db.from('email_sends').select('open_count').limit(1);
      return !error;
    },
  },
  {
    file: 'supabase/migrations/0005_blog_media.sql',
    applied: async () => {
      const db = serviceClient();
      if (!db) return true;
      const { error } = await db.from('posts').select('cover_url').limit(1);
      return !error;
    },
  },
  {
    file: 'supabase/migrations/0006_campaign_history.sql',
    applied: async () => {
      const db = serviceClient();
      if (!db) return true;
      const { error } = await db.from('campaign_stats').select('campaign_id').limit(1);
      return !error;
    },
  },
  {
    file: 'supabase/migrations/0007_priority_lists.sql',
    applied: async () => {
      const db = serviceClient();
      if (!db) return true;
      const { error } = await db.from('contacts').select('priority,list_name').limit(1);
      return !error;
    },
  },
  {
    // Starter templates per priority; only re-added if every one of them was deleted.
    file: 'supabase/migrations/0008_priority_templates.sql',
    applied: async () => {
      const db = serviceClient();
      if (!db) return true;
      const { count, error } = await db.from('email_templates').select('id', { count: 'exact', head: true }).like('name', 'P_ %·%');
      return !!error || (count ?? 0) > 0;
    },
  },
  {
    file: 'supabase/migrations/0009_automation.sql',
    applied: async () => {
      const db = serviceClient();
      if (!db) return true;
      const { error } = await db.from('automations').select('id').limit(1);
      return !error;
    },
  },
  {
    file: 'supabase/migrations/0010_priority_cities.sql',
    applied: async () => {
      const db = serviceClient();
      if (!db) return true;
      const { error } = await db.from('automations').select('priority_cities').limit(1);
      return !error;
    },
  },
  {
    file: 'supabase/migrations/0011_recipient_city.sql',
    applied: async () => {
      const db = serviceClient();
      if (!db) return true;
      const { error } = await db.from('email_sends').select('recipient_city').limit(1);
      return !error;
    },
  },
];

export async function withClient<T>(run: (c: Client) => Promise<T>) {
  const raw = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  if (!raw) throw new Error('POSTGRES_URL_NON_POOLING is not set. Connect Supabase to the Vercel project first.');
  // Supabase uses its own CA; pg treats sslmode=require as full verification, so set TLS explicitly.
  const url = new URL(raw);
  url.searchParams.delete('sslmode');
  url.searchParams.delete('supa');
  const client = new Client({ connectionString: url.toString(), ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    return await run(client);
  } finally {
    await client.end();
  }
}

const sql = (f: string) => readFileSync(join(process.cwd(), f), 'utf8');

/**
 * Creates the database schema and starter content using the Postgres URL that the
 * Vercel Supabase integration provides. Credentials never leave the server.
 */
export async function initDatabase(opts: { adminId?: string; adminName?: string } = {}) {
  await withClient(async (client) => {
    for (const f of FILES) await client.query(sql(f));
    if (opts.adminId) {
      await client.query(
        `insert into public.profiles (id, full_name, role) values ($1, $2, 'admin')
         on conflict (id) do update set role = 'admin'`,
        [opts.adminId, opts.adminName ?? 'Admin'],
      );
    }
    // Make the new tables visible to the Supabase API immediately.
    await client.query(`notify pgrst, 'reload schema'`);
  });
}

let ensured: Promise<void> | null = null;

/** Applies any pending upgrade migrations once per server instance. */
export function ensureSchema() {
  ensured ??= (async () => {
    const pending: string[] = [];
    for (const u of UPGRADES) if (!(await u.applied())) pending.push(u.file);
    if (!pending.length) return;
    await withClient(async (client) => {
      for (const f of pending) await client.query(sql(f));
      await client.query(`notify pgrst, 'reload schema'`);
    });
  })().catch((e) => {
    ensured = null; // try again on the next request
    console.error('[db] upgrade failed', e);
  });
  return ensured;
}
