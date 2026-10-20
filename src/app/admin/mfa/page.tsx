'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/brand';
import { browserClient } from '@/lib/supabase/browser';

// Where to go after 2FA; only internal admin paths are allowed.
function nextPath() {
  const n = new URLSearchParams(window.location.search).get('next') ?? '';
  return /^\/admin(\/[\w-]+)*$/.test(n) ? n : '/admin';
}

type Mode = { kind: 'loading' } | { kind: 'enroll'; factorId: string; qr: string; secret: string } | { kind: 'verify'; factorId: string };

/** Enrolls an authenticator app on first sign-in, then requires a 6-digit code every time. */
export default function MfaPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>({ kind: 'loading' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const sb = browserClient();
      const { data: aal } = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aal?.currentLevel === 'aal2') return router.replace(nextPath());
      const { data: role } = await sb.rpc('my_role');
      if (!role) {
        await sb.auth.signOut();
        return router.replace('/admin/login?error=not-staff');
      }
      const { data: factors } = await sb.auth.mfa.listFactors();
      const verified = factors?.totp.find((f) => f.status === 'verified');
      if (verified) return setMode({ kind: 'verify', factorId: verified.id });
      // Remove half-finished enrollments before starting a new one.
      for (const f of factors?.all ?? []) if (f.status !== 'verified') await sb.auth.mfa.unenroll({ factorId: f.id });
      const { data, error } = await sb.auth.mfa.enroll({ factorType: 'totp', friendlyName: `Authenticator ${Date.now()}` });
      if (error || !data) return setError(error?.message ?? 'Could not start 2FA setup.');
      setMode({ kind: 'enroll', factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
    })();
  }, [router]);

  const verify = async (code: string) => {
    if (mode.kind === 'loading') return;
    setBusy(true);
    setError('');
    const sb = browserClient();
    const { data: ch, error: chErr } = await sb.auth.mfa.challenge({ factorId: mode.factorId });
    if (chErr || !ch) {
      setBusy(false);
      return setError(chErr?.message ?? 'Could not verify.');
    }
    const { error } = await sb.auth.mfa.verify({ factorId: mode.factorId, challengeId: ch.id, code });
    setBusy(false);
    if (error) return setError('That code did not work. Try the current code.');
    router.replace(nextPath());
    router.refresh();
  };

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-charcoal p-5 text-center"><Logo /></div>
        <h1 className="mt-8 flex items-center gap-2 text-4xl"><ShieldCheck className="h-8 w-8 text-green-ink" aria-hidden /> Two-factor check</h1>
        {mode.kind === 'loading' && !error ? <Loader2 className="mt-6 h-6 w-6 animate-spin" aria-label="Loading" /> : null}
        {mode.kind === 'enroll' ? (
          <div className="mt-4">
            <p className="text-muted">Scan this QR code with an authenticator app (Google Authenticator, 1Password, Authy), then enter the 6-digit code.</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mode.qr} alt="2FA QR code" className="mx-auto mt-4 h-48 w-48 rounded-lg bg-white p-2" />
            <p className="mt-2 break-all text-center font-mono text-xs text-muted">Or enter key: {mode.secret}</p>
          </div>
        ) : null}
        {mode.kind === 'verify' ? <p className="mt-2 text-muted">Enter the 6-digit code from your authenticator app.</p> : null}
        {mode.kind !== 'loading' ? (
          <form
            className="mt-6 grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              verify(String(new FormData(e.currentTarget).get('code')).replace(/\s/g, ''));
            }}
          >
            <label htmlFor="code" className="label">Authentication code</label>
            <input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6} required className="field text-center font-mono text-2xl tracking-[0.5em]" />
            <button className="btn-primary" disabled={busy}>
              {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : null} Verify
            </button>
          </form>
        ) : null}
        {error ? <p role="alert" className="mt-4 rounded-md bg-[#FEE4E2] p-3 text-sm font-semibold text-[#912018]">{error}</p> : null}
        <button
          type="button"
          className="mt-6 text-sm font-semibold text-orange-ink underline underline-offset-4"
          onClick={async () => {
            await browserClient().auth.signOut();
            router.replace('/admin/login');
          }}
        >
          Sign out
        </button>
      </div>
    </main>
  );
}
