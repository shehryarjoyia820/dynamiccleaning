import Link from 'next/link';
import { FileText, HelpCircle, Inbox, LogOut, MapPin, Settings2, UserCog, Users } from 'lucide-react';
import { LogoMark } from '@/components/brand';
import { requireStaff } from '@/lib/admin';
import { signOut } from './actions';

export const dynamic = 'force-dynamic';

const NAV = [
  { href: '/admin', label: 'Leads', icon: Inbox },
  { href: '/admin/content/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/content/areas', label: 'Service areas', icon: MapPin },
  { href: '/admin/content/posts', label: 'Blog posts', icon: FileText },
  { href: '/admin/content/settings', label: 'Regulatory text', icon: Settings2 },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireStaff();
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="bg-charcoal text-white lg:min-h-screen">
        <div className="flex items-center gap-2 px-5 py-4">
          <LogoMark className="h-8 w-8" />
          <span className="font-display text-lg font-extrabold uppercase">
            Diesel <span className="text-orange">Dynamix</span>
          </span>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm text-white/85 hover:bg-white/10 hover:text-white">
              <n.icon className="h-4 w-4 text-orange" aria-hidden /> {n.label}
            </Link>
          ))}
          {profile.role === 'admin' ? (
            <Link href="/admin/team" className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm text-white/85 hover:bg-white/10 hover:text-white">
              <Users className="h-4 w-4 text-orange" aria-hidden /> Team
            </Link>
          ) : null}
          <Link href="/admin/account" className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm text-white/85 hover:bg-white/10 hover:text-white">
            <UserCog className="h-4 w-4 text-orange" aria-hidden /> My account
          </Link>
          <form action={signOut}>
            <button className="flex w-full shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm text-white/85 hover:bg-white/10 hover:text-white">
              <LogOut className="h-4 w-4 text-orange" aria-hidden /> Sign out
            </button>
          </form>
        </nav>
        <p className="hidden px-5 py-4 text-xs text-white/60 lg:block">
          Signed in as {profile.full_name || 'staff'} ({profile.role})
        </p>
      </aside>
      <main className="min-w-0 p-4 sm:p-8">{children}</main>
    </div>
  );
}
