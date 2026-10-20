import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const CONTENT_TAG = 'content';

export function supabaseConfigured() {
  return Boolean(URL && ANON);
}

/** Read-only public content client. Responses are cached and revalidated by tag. */
export function publicClient() {
  if (!URL || !ANON) return null;
  return createClient(URL, ANON, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, next: { revalidate: 300, tags: [CONTENT_TAG] } } as RequestInit),
    },
  });
}

/** Service-role client for trusted server code (lead intake). Bypasses RLS. */
export function serviceClient() {
  if (!URL || !SERVICE) return null;
  return createClient(URL, SERVICE, {
    auth: { persistSession: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }) },
  });
}

/** Cookie-bound client for the admin area. Row-level security applies. */
export async function sessionClient() {
  if (!URL || !ANON) throw new Error('Supabase is not configured');
  const store = await cookies();
  return createServerClient(URL, ANON, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Called from a Server Component; middleware refreshes the session instead.
        }
      },
    },
  });
}
