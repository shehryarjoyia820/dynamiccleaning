'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/brand';
import { browserClient } from '@/lib/supabase/browser';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState(params.get('error') === 'not-staff' ? 'This account does not have admin access.' : '');
  const [busy, setBusy] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  return (
    <form
      className="mt-8 grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError('');
        const f = new FormData(e.currentTarget);
        const { error } = await browserClient().auth.signInWithPassword({
          email: String(f.get('email')),
          password: String(f.get('password')),
        });
        setBusy(false);
        if (error) return setError('Email or password is incorrect.');
        router.replace('/admin/mfa');
        router.refresh();
      }}
    >
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="field" />
      </div>
      <div>
        <label htmlFor="password" className="label">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="field" />
      </div>
      {error ? <p role="alert" className="rounded-md bg-[#FEE4E2] p-3 text-sm font-semibold text-[#912018]">{error}</p> : null}
      {resetSent ? <p role="status" className="rounded-md bg-white p-3 text-sm">If that email has an account, a reset link is on its way.</p> : null}
      <button className="btn-primary" disabled={busy}>
        {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : null} Sign in
      </button>
      <button
        type="button"
        className="text-sm font-semibold text-orange-ink underline underline-offset-4"
        onClick={async (e) => {
          const email = (e.currentTarget.form?.elements.namedItem('email') as HTMLInputElement | null)?.value;
          if (!email) return setError('Enter your email first.');
          await browserClient().auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/admin/mfa?next=/admin/account` });
          setResetSent(true);
        }}
      >
        Forgot password?
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-xl bg-charcoal p-5 text-center"><Logo /></div>
        <h1 className="mt-8 text-4xl">Staff sign in</h1>
        <p className="mt-1 text-muted">Two-factor authentication is required.</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
