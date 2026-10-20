import { timingSafeEqual } from 'node:crypto';
import { redirect } from 'next/navigation';
import { Database, KeyRound, LockKeyhole } from 'lucide-react';
import { Logo } from '@/components/brand';
import { initDatabase } from '@/lib/db-init';
import { serviceClient, sessionClient, supabaseConfigured } from '@/lib/supabase/clients';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();

function mask(email: string) {
  const [u, d] = email.split('@');
  return `${u.slice(0, 2)}${'•'.repeat(Math.max(1, u.length - 2))}@${d}`;
}

/** 'missing' = tables not created yet; otherwise how many staff exist. */
async function status(): Promise<'missing' | number> {
  const db = serviceClient();
  if (!db) return 'missing';
  const { count, error } = await db.from('profiles').select('id', { count: 'exact', head: true });
  if (error) return 'missing';
  return count ?? 0;
}

function codeOk(input: string) {
  const expected = process.env.ADMIN_SETUP_TOKEN ?? '';
  const a = Buffer.from(input.trim());
  const b = Buffer.from(expected);
  return expected.length >= 16 && a.length === b.length && timingSafeEqual(a, b);
}

const fail = (m: string): never => redirect(`/admin/setup?error=${encodeURIComponent(m)}`);

/**
 * Setup and owner recovery, both unlocked by ADMIN_SETUP_TOKEN (only visible to
 * the Vercel project owner). Creates or updates the database, creates the
 * ADMIN_EMAIL login if needed, signs that person in on this browser and sends
 * them to choose a password. No email delivery is required.
 */
async function runSetup(form: FormData) {
  'use server';
  if (!ADMIN_EMAIL) fail('ADMIN_EMAIL is not set in Vercel.');
  if (!codeOk(String(form.get('code') ?? ''))) fail('That setup code is not correct.');
  const svc = serviceClient();
  if (!svc) return fail('Supabase keys are missing in Vercel.');

  // Create the admin login, or get a one-time sign-in for the existing one.
  let link = await svc.auth.admin.generateLink({ type: 'invite', email: ADMIN_EMAIL! });
  let otpType: 'invite' | 'magiclink' = 'invite';
  if (link.error) {
    link = await svc.auth.admin.generateLink({ type: 'magiclink', email: ADMIN_EMAIL! });
    otpType = 'magiclink';
  }
  if (link.error || !link.data.user) return fail(link.error?.message ?? 'Could not create the admin account.');
  const userId = link.data.user.id;

  // Apply every migration (idempotent) and make sure this login is an admin.
  let dbError = '';
  try {
    await initDatabase({ adminId: userId, adminName: 'Admin' });
  } catch (e) {
    dbError = e instanceof Error ? e.message : 'Database setup failed';
  }
  if (dbError) fail(`Database setup failed: ${dbError}`);

  // Login is email + password only, so remove any authenticator enrolled earlier.
  const { data: factors } = await svc.auth.admin.mfa.listFactors({ userId });
  for (const f of factors?.factors ?? []) await svc.auth.admin.mfa.deleteFactor({ userId, id: f.id });

  const session = await sessionClient();
  const { error } = await session.auth.verifyOtp({ type: otpType, token_hash: link.data.properties.hashed_token });
  if (error) fail(`Sign-in failed: ${error.message}`);
  redirect('/admin/account?welcome=1');
}

export default async function SetupPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const configured = supabaseConfigured() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const s = configured ? await status() : 'missing';
  const exists = s !== 'missing' && s > 0;

  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <div className="rounded-xl bg-charcoal p-6"><Logo /></div>
      {!configured ? (
        <>
          <h1 className="mt-8 text-4xl">Connect Supabase first</h1>
          <p className="mt-3 text-muted">In Vercel, open the project → Storage → connect a Supabase database, then redeploy and reload this page.</p>
        </>
      ) : (
        <>
          <h1 className="mt-8 text-4xl">{exists ? 'Owner access' : 'First-time setup'}</h1>
          {exists ? (
            <p className="mt-3 text-muted">
              The admin account already exists. Normally just <a href="/admin/login" className="font-semibold text-amber-ink underline">sign in</a>. Use the setup code
              here only to set or reset the password for <strong className="text-ink">{ADMIN_EMAIL ? mask(ADMIN_EMAIL) : 'the admin'}</strong>, or to apply database updates.
            </p>
          ) : (
            <ol className="mt-4 grid gap-3 text-muted">
              <li className="flex gap-3"><Database className="mt-0.5 h-5 w-5 shrink-0 text-amber-ink" aria-hidden /> Creates the database tables and starter content.</li>
              <li className="flex gap-3"><KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-amber-ink" aria-hidden /> Creates the admin login for <strong className="text-ink">{ADMIN_EMAIL ? mask(ADMIN_EMAIL) : '(ADMIN_EMAIL not set)'}</strong>.</li>
              <li className="flex gap-3"><LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-amber-ink" aria-hidden /> Takes you straight to choose your password.</li>
            </ol>
          )}
          <form action={runSetup} className="card mt-6 grid gap-3">
            <label htmlFor="code" className="label">Setup code</label>
            <input id="code" name="code" required autoComplete="off" className="field font-mono" />
            <p className="text-sm text-muted">
              Find it in Vercel → diesel-dynamix → Settings → Environment Variables → <code>ADMIN_SETUP_TOKEN</code> (click the eye icon). Delete that variable to switch this page off.
            </p>
            {sp.error ? <p role="alert" className="rounded-md bg-[#FEE4E2] p-3 text-sm font-semibold text-[#912018]">{sp.error}</p> : null}
            <button className="btn-primary">{exists ? 'Sign in & set password' : 'Set up database & admin'}</button>
          </form>
        </>
      )}
    </main>
  );
}
