import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Logo } from '@/components/brand';
import { WhatsAppIcon } from '@/components/contact-bars';
import { DISCLAIMER, FOOTER_LINKS, LINKS, SITE } from '@/lib/site';

export function Footer() {
  return (
    <footer className="bg-charcoal pb-24 text-white md:pb-0">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" aria-label="Diesel Dynamix home">
            <Logo />
          </Link>
          <p className="mt-4 max-w-sm text-muted-dark">
            Mobile CARB Clean Truck Check testing for owner-operators, carriers and fleets. We come to you, anywhere in California.
          </p>
          <ul className="mt-6 space-y-3">
            <li>
              <a href={LINKS.tel} data-track="call_click" className="inline-flex items-center gap-3 font-display text-2xl font-bold hover:text-orange">
                <Phone className="h-5 w-5 text-orange" aria-hidden /> {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer" data-track="whatsapp_click" className="inline-flex items-center gap-3 hover:text-orange">
                <WhatsAppIcon className="h-5 w-5 text-[#25D366]" /> WhatsApp us
              </a>
            </li>
            <li>
              <a href={LINKS.mailInfo} data-track="email_click" className="inline-flex items-center gap-3 hover:text-orange">
                <Mail className="h-5 w-5 text-orange" aria-hidden /> {SITE.emailInfo}
              </a>
            </li>
            <li>
              <a href={LINKS.mailService} data-track="email_click" className="inline-flex items-center gap-3 hover:text-orange">
                <Mail className="h-5 w-5 text-orange" aria-hidden /> {SITE.emailService}
              </a>
            </li>
            <li className="inline-flex items-center gap-3 text-muted-dark">
              <MapPin className="h-5 w-5 text-orange" aria-hidden /> Serving all of California
            </li>
          </ul>
        </div>
        {FOOTER_LINKS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="eyebrow text-orange">{col.title}</h2>
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
          <p className="rounded-md border border-orange/30 bg-orange/5 p-4 text-white/90" role="note">
            <strong className="text-orange">Independent provider notice:</strong> {DISCLAIMER} For official program rules see{' '}
            <a href={LINKS.carbCtc} target="_blank" rel="noopener noreferrer" className="font-semibold text-orange underline underline-offset-4">
              CARB Clean Truck Check
            </a>
            .
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Diesel Dynamix. All rights reserved.</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              <li><Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
