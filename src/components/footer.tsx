import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Logo } from '@/components/brand';
import { WhatsAppIcon } from '@/components/contact-bars';
import { CookieSettingsButton } from '@/components/cookie-settings-button';
import { NewsletterForm } from '@/components/newsletter';
import { DISCLAIMER, FOOTER_LINKS, LINKS, SITE } from '@/lib/site';

export function Footer() {
  return (
    <footer className="bg-charcoal pb-24 text-white md:pb-0">
      <div className="container grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:py-14 md:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-3 lg:col-span-1">
          <Link href="/" aria-label="Diesel Dynamix home">
            <Logo />
          </Link>
          <p className="mt-4 max-w-sm text-muted-dark">
            Mobile CARB Clean Truck Check testing for owner-operators, carriers and fleets. We come to you, anywhere in Southern California.
          </p>
          <ul className="mt-6 space-y-3">
            <li>
              <a href={LINKS.tel} data-track="call_click" className="inline-flex items-center gap-3 font-display text-2xl font-bold hover:text-accent">
                <Phone className="h-5 w-5 text-accent" aria-hidden /> {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer" data-track="whatsapp_click" className="inline-flex items-center gap-3 hover:text-accent">
                <WhatsAppIcon className="h-5 w-5 text-[#25D366]" /> WhatsApp us
              </a>
            </li>
            <li>
              <a href={LINKS.mailService} data-track="email_click" className="inline-flex items-center gap-3 hover:text-accent">
                <Mail className="h-5 w-5 text-accent" aria-hidden /> {SITE.emailService}
              </a>
            </li>
            <li className="inline-flex items-center gap-3 text-muted-dark">
              <MapPin className="h-5 w-5 text-accent" aria-hidden /> Serving Southern California
            </li>
          </ul>
          <div className="mt-8 max-w-sm">
            <NewsletterForm />
          </div>
        </div>
        {FOOTER_LINKS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="eyebrow text-accent">{col.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/80 hover:text-white hover:underline hover:underline-offset-4">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container py-6 text-sm text-muted-dark">
          <p className="rounded-md border border-accent/30 bg-accent/5 p-4 text-white/90" role="note">
            <strong className="text-accent">Independent provider notice:</strong> {DISCLAIMER} For official program rules see{' '}
            <a href={LINKS.carbCtc} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent underline underline-offset-4">
              CARB Clean Truck Check
            </a>
            .
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Diesel Dynamix. All rights reserved.</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              <li><Link href="/cookies" className="hover:text-white">Cookie Policy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white">Disclaimer</Link></li>
              <li><Link href="/accessibility" className="hover:text-white">Accessibility</Link></li>
              <li><Link href="/do-not-sell" className="hover:text-white">Do Not Sell or Share My Info</Link></li>
              <li><CookieSettingsButton className="hover:text-white" /></li>
              <li><Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
