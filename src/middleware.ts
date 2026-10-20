import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/** Keeps the Supabase session fresh for /admin and sends signed-out visitors to the login page. */
export async function middleware(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return NextResponse.next();

  let res = NextResponse.next({ request: req });
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublic = req.nextUrl.pathname === '/admin/login' || req.nextUrl.pathname === '/admin/setup';
  if (!user && !isPublic) {
    const to = req.nextUrl.clone();
    to.pathname = '/admin/login';
    to.search = '';
    return NextResponse.redirect(to);
  }
  return res;
}

export const config = { matcher: ['/admin/:path*'] };
