'use client';

import Link from 'next/link';
import { useActionState, useRef } from 'react';
import { Loader2, Send } from 'lucide-react';
import { importContacts, type ImportResult } from '../../email-actions';
import { AdminTitle } from '../../ui';

export default function ImportPage() {
  const [state, action, pending] = useActionState<ImportResult | null, FormData>(importContacts, null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  return (
    <>
      <AdminTitle title="Upload emails" />
      <form action={action} className="card grid max-w-3xl gap-4">
        <div>
          <label htmlFor="file" className="label">CSV file</label>
          <input
            id="file"
            type="file"
            accept=".csv,.txt,text/csv,text/plain"
            className="block text-sm"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f && textRef.current) textRef.current.value = await f.text();
            }}
          />
          <p className="mt-1 text-sm text-muted">Columns are detected from the header: <code>email</code>, <code>name</code>, <code>company</code>, <code>phone</code>. Excel → File → Save As → CSV.</p>
        </div>
        <div>
          <label htmlFor="csv" className="label">…or paste emails (one per line, or CSV)</label>
          <textarea id="csv" name="csv" ref={textRef} rows={10} className="field font-mono text-sm" placeholder={'email,name,company\njohn@acmetrucking.com,John Smith,Acme Trucking'} />
        </div>
        <div>
          <label htmlFor="tag" className="label">Tag for this upload</label>
          <input id="tag" name="tag" className="field max-w-sm" placeholder={`e.g. fleet-list-${new Date().toISOString().slice(0, 7)}`} />
          <p className="mt-1 text-sm text-muted">You can send a proposal to exactly this group using the tag.</p>
        </div>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="confirm" className="mt-1 h-4 w-4" />
          <span>
            I confirm these are business contacts Diesel Dynamix may email. Every email includes an unsubscribe link and our address (US CAN-SPAM). People who
            already unsubscribed are never emailed again.
          </span>
        </label>
        <button className="btn-primary justify-self-start !min-h-[44px]" disabled={pending}>
          {pending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : null} Import contacts
        </button>
        {state ? (
          <div role="status" className={state.ok ? 'rounded-lg bg-green/10 p-4' : 'rounded-lg bg-[#FEE4E2] p-4 text-[#912018]'}>
            <p className="font-semibold">{state.message}</p>
            {state.invalid?.length ? (
              <details className="mt-2 text-sm">
                <summary>{state.invalid.length} row(s) skipped (no valid email)</summary>
                <ul className="mt-1 font-mono text-xs">{state.invalid.map((l, i) => <li key={i}>{l}</li>)}</ul>
              </details>
            ) : null}
            {state.ok && state.tag ? (
              <Link href={`/admin/emails/campaigns/new?tag=${encodeURIComponent(state.tag)}`} className="mt-3 inline-flex items-center gap-2 rounded-md bg-amber px-4 py-2 text-sm font-bold text-ink hover:bg-amber-deep">
                <Send className="h-4 w-4" aria-hidden /> Send proposal to these contacts
              </Link>
            ) : null}
          </div>
        ) : null}
      </form>
    </>
  );
}
