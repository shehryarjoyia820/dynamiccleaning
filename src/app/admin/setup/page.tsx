import { Logo } from '@/components/brand';

export default function SetupPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-xl bg-charcoal p-6"><Logo /></div>
      <h1 className="mt-8 text-4xl">Admin not configured yet</h1>
      <p className="mt-3 text-muted">
        The admin dashboard needs a Supabase project. Add <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and{' '}
        <code>SUPABASE_SERVICE_ROLE_KEY</code> to the environment, run the SQL in <code>supabase/migrations</code> and <code>supabase/seed.sql</code>, then
        redeploy. See <code>DEPLOYMENT.md</code> in the repository.
      </p>
    </main>
  );
}
