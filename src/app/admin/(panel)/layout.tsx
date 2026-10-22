import Link from 'next/link';
import { Suspense } from 'react';
import { Bot, Contact, ExternalLink, FileText, Globe, HelpCircle, Inbox, LogOut, Mail, MapPin, Send, Settings2, UserCog, Users } from 'lucide-react';
import { LogoMark } from '@/components/brand';
import { requireStaff } from '@/lib/admin';
import { ensureSchema } from '@/lib/db-init';
import { signOut } from './actions';
import { AdminNotice } from './notice';

export const dynamic = 'force-dynamic';

const NAV = [
  { href: '/admin', label: 'Leads', icon: Inbox },
  { href: '/admin/contacts', label: 'Contacts & subscribers', icon: Contact },
  { href: '/admin/automation', label: 'Automation', icon: Bot },
  { href: '/admin/emails/campaigns', label: 'Campaigns', icon: Send },
  { href: '/admin/emails/templates', label: 'Email templates', icon: Mail },
  { href: '/admin/content/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/content/areas', label: 'Service areas', icon: MapPin },
  { href: '/admin/content/posts', label: 'Blog posts', icon: FileText },
  { href: '/admin/content/settings', label: 'Settings & regulatory text', icon: Settings2 },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireStaff();
  // Apply any new database upgrades (no-op once applied).
  await ensureSchema();
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="bg-charcoal text-white lg:min-h-screen">
        <div className="flex items-center justify-between gap-2 px-5 py-4">
          <Link href="/admin" className="flex items-center gap-2">
            <LogoMark className="h-8 w-8" />
            <span className="font-display text-lg font-extrabold uppercase">
              Diesel <span className="text-accent">Dynamix</span>
            </span>
          </Link>
          {/* Compact shortcut for phones, where the full nav scrolls sideways. */}
          <a href="/" target="_blank" rel="noopener" className="inline-flex items-center gap-1 rounded-md border border-white/20 px-2.5 py-1.5 text-xs font-semibold hover:bg-white/10 lg:hidden">
            <Globe className="h-3.5 w-3.5 text-accent" aria-hidden /> Website
          </a>
        </div>
        <div className="hidden px-3 pb-2 lg:block">
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-between gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-semibold text-white hover:border-accent hover:bg-white/10"
          >
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-accent" aria-hidden /> Visit website
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-white/60" aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm text-white/85 hover:bg-white/10 hover:text-white">
              <n.icon className="h-4 w-4 text-accent" aria-hidden /> {n.label}
            </Link>
          ))}
          {profile.role === 'admin' ? (
            <Link href="/admin/team" className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm text-white/85 hover:bg-white/10 hover:text-white">
              <Users className="h-4 w-4 text-accent" aria-hidden /> Team
            </Link>
          ) : null}
          <Link href="/admin/account" className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm text-white/85 hover:bg-white/10 hover:text-white">
            <UserCog className="h-4 w-4 text-accent" aria-hidden /> My account
          </Link>
          <form action={signOut}>
            <button className="flex w-full shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm text-white/85 hover:bg-white/10 hover:text-white">
              <LogOut className="h-4 w-4 text-accent" aria-hidden /> Sign out
            </button>
          </form>
        </nav>
        <p className="hidden px-5 py-4 text-xs text-white/60 lg:block">
          Signed in as {profile.full_name || 'staff'} ({profile.role})
        </p>
      </aside>
      <main className="min-w-0 p-4 sm:p-8">
        <Suspense>
          <AdminNotice />
        </Suspense>
        {children}
      </main>
    </div>
  );
}
