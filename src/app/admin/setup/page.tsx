import { timingSafeEqual } from 'node:crypto';
import { redirect } from 'next/navigation';
import { CheckCircle2, Database, KeyRound, ShieldCheck } from 'lucide-react';
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

/**
 * First-run setup. Protected by ADMIN_SETUP_TOKEN (only visible to the Vercel
 * project owner) and disabled once an admin exists. It creates the database
 * tables, creates the ADMIN_EMAIL account and signs that person straight into
 * the 2FA + choose-password steps, so no invite email is needed.
 */
async function runSetup(form: FormData) {
  'use server';
  const fail = (m: string) => redirect(`/admin/setup?error=${encodeURIComponent(m)}`);
  if (!ADMIN_EMAIL) fail('ADMIN_EMAIL is not set in Vercel.');
  if (!codeOk(String(form.get('code') ?? ''))) fail('That setup code is not correct.');
  const s = await status();
  if (s !== 'missing' && s > 0) redirect('/admin/login');

  const svc = serviceClient();
  if (!svc) fail('Supabase keys are missing in Vercel.');

  // Create the admin login (or reuse it if a previous attempt created it).
  let link = await svc!.auth.admin.generateLink({ type: 'invite', email: ADMIN_EMAIL! });
  let otpType: 'invite' | 'magiclink' = 'invite';
  if (link.error) {
    link = await svc!.auth.admin.generateLink({ type: 'magiclink', email: ADMIN_EMAIL! });
    otpType = 'magiclink';
  }
  if (link.error || !link.data.user) fail(link.error?.message ?? 'Could not create the admin account.');

  let dbError = '';
  try {
    await initDatabase({ adminId: link.data.user!.id, adminName: 'Admin' });
  } catch (e) {
    dbError = e instanceof Error ? e.message : 'Database setup failed';
  }
  if (dbError) fail(`Database setup failed: ${dbError}`);

  // Sign the admin in on this browser; next they set up 2FA and choose a password.
  const session = await sessionClient();
  const { error } = await session.auth.verifyOtp({ type: otpType, token_hash: link.data.properties!.hashed_token });
  if (error) fail(`Sign-in failed: ${error.message}`);
  redirect('/admin/mfa?next=/admin/account');
}

export default async function SetupPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const configured = supabaseConfigured() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const s = configured ? await status() : 'missing';
  const done = s !== 'missing' && s > 0;

  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <div className="rounded-xl bg-charcoal p-6"><Logo /></div>
      {!configured ? (
        <>
          <h1 className="mt-8 text-4xl">Connect Supabase first</h1>
          <p className="mt-3 text-muted">In Vercel, open the project → Storage → connect a Supabase database, then redeploy and reload this page.</p>
        </>
      ) : done ? (
        <>
          <CheckCircle2 className="mt-8 h-12 w-12 text-green" aria-hidden />
          <h1 className="mt-3 text-4xl">Admin is set up</h1>
          <p className="mt-3 text-muted">
            <a href="/admin/login" className="font-semibold text-amber-ink underline">Sign in</a> with your email, password and authenticator code. Admins can invite more staff from the Team page.
          </p>
        </>
      ) : (
        <>
          <h1 className="mt-8 text-4xl">First-time setup</h1>
          <ol className="mt-4 grid gap-3 text-muted">
            <li className="flex gap-3"><Database className="mt-0.5 h-5 w-5 shrink-0 text-amber-ink" aria-hidden /> Creates the database tables and starter content.</li>
            <li className="flex gap-3"><KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-amber-ink" aria-hidden /> Creates the admin login for <strong className="text-ink">{ADMIN_EMAIL ? mask(ADMIN_EMAIL) : '(ADMIN_EMAIL not set)'}</strong>.</li>
            <li className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-ink" aria-hidden /> Takes you to set up 2FA and choose your own password.</li>
          </ol>
          <form action={runSetup} className="card mt-6 grid gap-3">
            <label htmlFor="code" className="label">Setup code</label>
            <input id="code" name="code" required autoComplete="off" className="field font-mono" />
            <p className="text-sm text-muted">
              Find it in Vercel → diesel-dynamix → Settings → Environment Variables → <code>ADMIN_SETUP_TOKEN</code> (click the eye icon). This page stops working once an admin exists.
            </p>
            {sp.error ? <p role="alert" className="rounded-md bg-[#FEE4E2] p-3 text-sm font-semibold text-[#912018]">{sp.error}</p> : null}
            <button className="btn-primary">Set up database &amp; admin</button>
          </form>
        </>
      )}
    </main>
  );
}
