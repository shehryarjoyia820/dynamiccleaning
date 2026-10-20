import 'server-only';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Client } from 'pg';

// Run in order. Every file is idempotent (create if not exists / on conflict do nothing).
const FILES = ['supabase/migrations/0001_init.sql', 'supabase/migrations/0002_email.sql', 'supabase/seed.sql'];

/**
 * Creates the database schema and starter content using the Postgres URL that the
 * Vercel Supabase integration provides. Credentials never leave the server.
 */
export async function initDatabase(opts: { adminId?: string; adminName?: string } = {}) {
  const raw = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  if (!raw) throw new Error('POSTGRES_URL_NON_POOLING is not set. Connect Supabase to the Vercel project first.');
  // Supabase uses its own CA; pg treats sslmode=require as full verification, so set TLS explicitly.
  const url = new URL(raw);
  url.searchParams.delete('sslmode');
  url.searchParams.delete('supa');
  const client = new Client({ connectionString: url.toString(), ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    for (const f of FILES) {
      await client.query(readFileSync(join(process.cwd(), f), 'utf8'));
    }
    if (opts.adminId) {
      await client.query(
        `insert into public.profiles (id, full_name, role) values ($1, $2, 'admin')
         on conflict (id) do update set role = 'admin'`,
        [opts.adminId, opts.adminName ?? 'Admin'],
      );
    }
    // Make the new tables visible to the Supabase API immediately.
    await client.query(`notify pgrst, 'reload schema'`);
  } finally {
    await client.end();
  }
}
