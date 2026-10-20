'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { browserClient } from '@/lib/supabase/browser';
import { AdminTitle, SmallButton } from '../ui';

export default function AccountPage() {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <>
      <AdminTitle title="My account" />
      <form
        className="card grid max-w-md gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const f = new FormData(form);
          const pw = String(f.get('password'));
          if (pw !== String(f.get('confirm'))) return setMsg({ ok: false, text: 'Passwords do not match.' });
          setBusy(true);
          const { error } = await browserClient().auth.updateUser({ password: pw });
          setBusy(false);
          setMsg(error ? { ok: false, text: error.message } : { ok: true, text: 'Password updated.' });
          if (!error) form.reset();
        }}
      >
        <h2 className="text-2xl">Set a new password</h2>
        <div>
          <label htmlFor="password" className="label">New password (12+ characters)</label>
          <input id="password" name="password" type="password" minLength={12} required autoComplete="new-password" className="field" />
        </div>
        <div>
          <label htmlFor="confirm" className="label">Confirm password</label>
          <input id="confirm" name="confirm" type="password" minLength={12} required autoComplete="new-password" className="field" />
        </div>
        {msg ? <p role="status" className={msg.ok ? 'text-sm font-semibold text-green-ink' : 'text-sm font-semibold text-[#B42318]'}>{msg.text}</p> : null}
        <SmallButton className="justify-self-start px-5 py-2.5" disabled={busy}>
          {busy ? <Loader2 className="mr-1 inline h-4 w-4 animate-spin" aria-hidden /> : null} Update password
        </SmallButton>
      </form>
    </>
  );
}
