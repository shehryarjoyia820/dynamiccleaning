'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useId, useRef, useState } from 'react';
import { CheckCircle2, Loader2, Phone } from 'lucide-react';
import { track } from '@/components/client-effects';
import { WhatsAppIcon } from '@/components/contact-bars';
import { LINKS, SITE } from '@/lib/site';
import { cn } from '@/lib/utils';

const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Status = { state: 'idle' | 'sending' | 'done' | 'error'; message?: string; errors?: Record<string, string> };

async function submit(form: HTMLFormElement, kind: 'booking' | 'contact', source: string): Promise<Status> {
  const data = Object.fromEntries(new FormData(form).entries());
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...data, kind, source_page: `${location.pathname} (${source})` }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { state: 'error', message: json.error ?? 'Something went wrong.', errors: json.fieldErrors };
    track('generate_lead', { form: kind, source });
    return { state: 'done' };
  } catch {
    return { state: 'error', message: 'Network error. Please try again, or call us.' };
  }
}

function Field({
  label,
  name,
  error,
  required,
  className,
  children,
  hint,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  className?: string;
  hint?: string;
  children: (props: { id: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string; name: string; required?: boolean }) => React.ReactNode;
}) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label} {required ? <span className="text-accent-ink" aria-hidden>*</span> : <span className="font-normal text-muted">(optional)</span>}
      </label>
      {children({ id, name, required, 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? errId : undefined })}
      {hint && !error ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
      {error ? (
        <p id={errId} className="mt-1 text-sm font-semibold text-[#B42318]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

function Turnstile() {
  if (!TURNSTILE_KEY) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <div className="cf-turnstile" data-sitekey={TURNSTILE_KEY} data-appearance="interaction-only" />
    </>
  );
}

function Consent({ error }: { error?: string }) {
  const id = useId();
  return (
    <div>
      <div className="flex items-start gap-3">
        <input id={id} type="checkbox" name="consent" value="yes" required className="mt-1 h-5 w-5 shrink-0 accent-accent-ink" />
        <label htmlFor={id} className="text-sm text-muted">
          I agree that Diesel Dynamix may contact me by phone, text, WhatsApp or email about this request. We never sell your information. See our{' '}
          <Link href="/privacy" className="font-semibold text-accent-ink underline underline-offset-4" target="_blank">
            Privacy Policy
          </Link>
          .
        </label>
      </div>
      {error ? <p className="mt-1 text-sm font-semibold text-[#B42318]">{error}</p> : null}
    </div>
  );
}

function Success({ title, text }: { title: string; text: string }) {
  return (
    <div role="status" className="rounded-xl border border-green/30 bg-white p-6 text-center shadow-card">
      <CheckCircle2 className="mx-auto h-12 w-12 text-green" aria-hidden />
      <h3 className="mt-3 text-3xl">{title}</h3>
      <p className="mt-2 text-muted">{text}</p>
      <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
        <a href={LINKS.tel} data-track="call_click" className="btn-ghost-light">
          <Phone className="h-5 w-5" aria-hidden /> {SITE.phoneDisplay}
        </a>
        <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer" data-track="whatsapp_click" className="btn-whatsapp">
          <WhatsAppIcon className="h-5 w-5" /> WhatsApp
        </a>
      </div>
    </div>
  );
}

export function BookingForm({
  compact,
  defaultLocation,
  defaultTrucks,
  source = 'page',
}: {
  compact?: boolean;
  defaultLocation?: string;
  defaultTrucks?: number;
  source?: string;
}) {
  const [status, setStatus] = useState<Status>({ state: 'idle' });
  const ref = useRef<HTMLFormElement>(null);
  const e = status.errors ?? {};
  const today = new Date().toISOString().slice(0, 10);

  if (status.state === 'done') {
    return (
      <Success
        title="Request received"
        text="Thanks! We have your booking request and sent a confirmation to your email. Our team will contact you shortly to confirm the time."
      />
    );
  }

  return (
    <form
      ref={ref}
      noValidate
      className="relative grid gap-4 sm:grid-cols-2"
      onSubmit={async (ev) => {
        ev.preventDefault();
        if (!ref.current?.checkValidity()) {
          ref.current?.reportValidity();
          return;
        }
        setStatus({ state: 'sending' });
        setStatus(await submit(ref.current, 'booking', source));
      }}
    >
      <Honeypot />
      <Field label="Full name" name="full_name" required error={e.full_name}>
        {(p) => <input {...p} className="field" autoComplete="name" maxLength={120} />}
      </Field>
      <Field label="Company" name="company" error={e.company}>
        {(p) => <input {...p} className="field" autoComplete="organization" maxLength={160} />}
      </Field>
      <Field label="Phone" name="phone" required error={e.phone}>
        {(p) => <input {...p} type="tel" className="field" autoComplete="tel" inputMode="tel" maxLength={30} />}
      </Field>
      <Field label="Email" name="email" required error={e.email}>
        {(p) => <input {...p} type="email" className="field" autoComplete="email" maxLength={160} />}
      </Field>
      <Field label="Number of trucks" name="trucks" required error={e.trucks}>
        {(p) => <input {...p} type="number" min={1} max={5000} defaultValue={defaultTrucks ?? 1} className="field" inputMode="numeric" />}
      </Field>
      <Field label="Truck location (city or ZIP)" name="location" required error={e.location}>
        {(p) => <input {...p} className="field" autoComplete="postal-code" defaultValue={defaultLocation} maxLength={120} />}
      </Field>
      <Field label="Engine type" name="engine_type" required error={e.engine_type}>
        {(p) => (
          <select {...p} className="field" defaultValue="">
            <option value="" disabled>
              Select one
            </option>
            <option value="obd">OBD (2013+ diesel / 2018+ alt-fuel)</option>
            <option value="non_obd">Non-OBD (older engines)</option>
            <option value="mixed">Mixed fleet</option>
            <option value="not_sure">Not sure</option>
          </select>
        )}
      </Field>
      <Field label="Preferred date" name="preferred_date" error={e.preferred_date}>
        {(p) => <input {...p} type="date" min={today} className="field" />}
      </Field>
      <Field label="Notes" name="notes" error={e.notes} className={cn('sm:col-span-2', compact && 'hidden sm:block')}>
        {(p) => <textarea {...p} rows={compact ? 2 : 3} className="field" maxLength={2000} placeholder="Deadlines, gate access, best time to call…" />}
      </Field>
      <div className="sm:col-span-2">
        <Consent error={e.consent} />
      </div>
      <div className="sm:col-span-2">
        <Turnstile />
      </div>
      {status.state === 'error' ? (
        <p role="alert" className="rounded-md bg-[#FEE4E2] p-3 text-sm font-semibold text-[#912018] sm:col-span-2">
          {status.message}
        </p>
      ) : null}
      <div className="sm:col-span-2">
        <button type="submit" className="btn-primary w-full" disabled={status.state === 'sending'}>
          {status.state === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : null}
          {status.state === 'sending' ? 'Sending…' : 'Request My Testing Appointment'}
        </button>
        <p className="mt-2 text-center text-sm text-muted">
          Prefer to talk?{' '}
          <a href={LINKS.tel} data-track="call_click" className="font-semibold text-accent-ink underline underline-offset-4">
            Call {SITE.phoneDisplay}
          </a>
        </p>
      </div>
    </form>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: 'idle' });
  const ref = useRef<HTMLFormElement>(null);
  const e = status.errors ?? {};

  if (status.state === 'done') {
    return <Success title="Message sent" text="Thanks for reaching out. We will get back to you shortly." />;
  }

  return (
    <form
      ref={ref}
      noValidate
      className="relative grid gap-4 sm:grid-cols-2"
      onSubmit={async (ev) => {
        ev.preventDefault();
        if (!ref.current?.checkValidity()) {
          ref.current?.reportValidity();
          return;
        }
        setStatus({ state: 'sending' });
        setStatus(await submit(ref.current, 'contact', 'contact-page'));
      }}
    >
      <Honeypot />
      <Field label="Full name" name="full_name" required error={e.full_name}>
        {(p) => <input {...p} className="field" autoComplete="name" maxLength={120} />}
      </Field>
      <Field label="Phone" name="phone" error={e.phone}>
        {(p) => <input {...p} type="tel" className="field" autoComplete="tel" maxLength={30} />}
      </Field>
      <Field label="Email" name="email" required error={e.email} className="sm:col-span-2">
        {(p) => <input {...p} type="email" className="field" autoComplete="email" maxLength={160} />}
      </Field>
      <Field label="Message" name="message" required error={e.message} className="sm:col-span-2">
        {(p) => <textarea {...p} rows={5} className="field" maxLength={4000} />}
      </Field>
      <div className="sm:col-span-2">
        <Consent error={e.consent} />
      </div>
      <div className="sm:col-span-2">
        <Turnstile />
      </div>
      {status.state === 'error' ? (
        <p role="alert" className="rounded-md bg-[#FEE4E2] p-3 text-sm font-semibold text-[#912018] sm:col-span-2">
          {status.message}
        </p>
      ) : null}
      <button type="submit" className="btn-primary sm:col-span-2" disabled={status.state === 'sending'}>
        {status.state === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : null}
        {status.state === 'sending' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
