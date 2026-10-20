import { redirect } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/brand';
import { SITE } from '@/lib/site';
import { serviceClient, supabaseConfigured } from '@/lib/supabase/clients';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();

function mask(email: string) {
  const [u, d] = email.split('@');
  return `${u.slice(0, 2)}${'•'.repeat(Math.max(1, u.length - 2))}@${d}`;
}

async function noAdminsYet() {
  const db = serviceClient();
  if (!db) return false;
  const { count, error } = await db.from('profiles').select('id', { count: 'exact', head: true });
  return !error && (count ?? 0) === 0;
}

/**
 * First-run: invites ADMIN_EMAIL as the first admin. Only works while no staff
 * exist, and only ever emails the address configured in the environment, so
 * nobody else can claim the dashboard.
 */
async function inviteFirstAdmin() {
  'use server';
  const db = serviceClient();
  if (!db || !ADMIN_EMAIL || !(await noAdminsYet())) redirect('/admin/setup');
  const { data, error } = await db.auth.admin.inviteUserByEmail(ADMIN_EMAIL, {
    redirectTo: `${SITE.url}/admin/mfa?next=/admin/account`,
  });
  if (error || !data.user) redirect(`/admin/setup?error=${encodeURIComponent(error?.message ?? 'Invite failed')}`);
  await db.from('profiles').upsert({ id: data.user.id, full_name: 'Admin', role: 'admin' });
  redirect('/admin/setup?sent=1');
}

export default async function SetupPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const configured = supabaseConfigured() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const empty = configured ? await noAdminsYet() : false;

  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <div className="rounded-xl bg-charcoal p-6"><Logo /></div>
      {!configured ? (
        <>
          <h1 className="mt-8 text-4xl">Admin not configured yet</h1>
          <p className="mt-3 text-muted">
            The admin dashboard needs a Supabase project. Add <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and{' '}
            <code>SUPABASE_SERVICE_ROLE_KEY</code> in Vercel, run the SQL files in <code>supabase/</code>, then redeploy. See <code>DEPLOYMENT.md</code>.
          </p>
        </>
      ) : sp.sent ? (
        <div className="mt-8 card text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green" aria-hidden />
          <h1 className="mt-3 text-3xl">Invite sent</h1>
          <p className="mt-2 text-muted">
            Check {ADMIN_EMAIL ? mask(ADMIN_EMAIL) : 'your inbox'}. Open the link, scan the 2FA QR code with an authenticator app, then choose your password. After that, sign in at /admin/login with your email and password.
          </p>
        </div>
      ) : empty ? (
        <>
          <h1 className="mt-8 text-4xl">Create the first admin</h1>
          {ADMIN_EMAIL ? (
            <form action={inviteFirstAdmin} className="mt-4">
              <p className="text-muted">
                An invite will be emailed to <strong>{mask(ADMIN_EMAIL)}</strong> (the <code>ADMIN_EMAIL</code> setting). Only that inbox can create the admin account.
              </p>
              {sp.error ? <p role="alert" className="mt-3 rounded-md bg-[#FEE4E2] p-3 text-sm font-semibold text-[#912018]">{sp.error}</p> : null}
              <button className="btn-primary mt-6">Send admin invite</button>
            </form>
          ) : (
            <p className="mt-3 text-muted">Set <code>ADMIN_EMAIL</code> in Vercel to the email that should own the dashboard, redeploy, then reload this page.</p>
          )}
        </>
      ) : (
        <>
          <h1 className="mt-8 text-4xl">Admin is set up</h1>
          <p className="mt-3 text-muted">
            <a href="/admin/login" className="font-semibold text-amber-ink underline">Sign in</a>. Admins can invite more staff from the Team page.
          </p>
        </>
      )}
    </main>
  );
}
