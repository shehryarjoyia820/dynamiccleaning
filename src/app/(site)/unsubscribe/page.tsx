import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { PageHero } from '@/components/blocks';
import { verifyUnsubscribe } from '@/lib/campaigns';
import { serviceClient } from '@/lib/supabase/clients';

export const metadata: Metadata = { title: 'Unsubscribe', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

async function unsubscribe(form: FormData) {
  'use server';
  const c = String(form.get('c') ?? '');
  const t = String(form.get('t') ?? '');
  if (!verifyUnsubscribe(c, t)) redirect('/unsubscribe?error=1');
  const db = serviceClient();
  if (db) {
    await db.from('contacts').update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() }).eq('id', c);
    await db.from('email_sends').update({ status: 'cancelled', error: 'Unsubscribed' }).eq('contact_id', c).eq('status', 'queued');
  }
  redirect(`/unsubscribe?done=1&c=${encodeURIComponent(c)}&t=${encodeURIComponent(t)}`);
}

/** Lets someone who unsubscribed opt back in from the same signed link. */
async function resubscribe(form: FormData) {
  'use server';
  const c = String(form.get('c') ?? '');
  const t = String(form.get('t') ?? '');
  if (!verifyUnsubscribe(c, t)) redirect('/unsubscribe?error=1');
  const db = serviceClient();
  if (db) await db.from('contacts').update({ status: 'subscribed', unsubscribed_at: null }).eq('id', c);
  redirect('/unsubscribe?resubscribed=1');
}

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const valid = sp.c && sp.t && verifyUnsubscribe(sp.c, sp.t);
  return (
    <>
      <PageHero eyebrow="Email preferences" title="Unsubscribe" intro="" crumbs={[{ name: 'Unsubscribe', path: '/unsubscribe' }]}>
        <span />
      </PageHero>
      <section className="py-section">
        <div className="container max-w-xl">
          <div className="card text-center">
            {sp.resubscribed ? (
              <>
                <CheckCircle2 className="mx-auto h-12 w-12 text-green" aria-hidden />
                <h2 className="mt-3 text-3xl">You’re subscribed again</h2>
                <p className="mt-2 text-muted">Welcome back. You’ll get Clean Truck Check reminders and updates from Diesel Dynamix.</p>
              </>
            ) : sp.done ? (
              <>
                <CheckCircle2 className="mx-auto h-12 w-12 text-green" aria-hidden />
                <h2 className="mt-3 text-3xl">You’re unsubscribed</h2>
                <p className="mt-2 text-muted">You won’t receive marketing emails from Diesel Dynamix any more. Replies about bookings you request may still be sent.</p>
                {valid ? (
                  <form action={resubscribe} className="mt-6">
                    <input type="hidden" name="c" value={sp.c} />
                    <input type="hidden" name="t" value={sp.t} />
                    <p className="text-sm text-muted">Changed your mind?</p>
                    <button className="btn-ghost-light mt-2">Subscribe again</button>
                  </form>
                ) : null}
              </>
            ) : valid ? (
              <form action={unsubscribe}>
                <input type="hidden" name="c" value={sp.c} />
                <input type="hidden" name="t" value={sp.t} />
                <h2 className="text-3xl">Stop receiving our emails?</h2>
                <p className="mt-2 text-muted">Click below and we will remove you from all proposals, follow-ups and updates.</p>
                <button className="btn-primary mt-6">Unsubscribe me</button>
              </form>
            ) : (
              <>
                <h2 className="text-3xl">Link not valid</h2>
                <p className="mt-2 text-muted">Please use the unsubscribe link in the email, or email service@dieseldynamix.com and we will remove you.</p>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
