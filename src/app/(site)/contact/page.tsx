import { Mail, MapPin, Phone } from 'lucide-react';
import { PageHero, Reveal } from '@/components/blocks';
import { WhatsAppIcon } from '@/components/contact-bars';
import { ContactForm } from '@/components/forms';
import { pageMeta } from '@/components/seo';
import { LINKS, SITE } from '@/lib/site';

export const metadata = pageMeta({
  title: 'Contact Us',
  description: `Call, WhatsApp or email Diesel Dynamix for mobile Clean Truck Check testing in Southern California. ${SITE.phoneDisplay}.`,
  path: '/contact',
});

const CHANNELS = [
  { icon: Phone, label: 'Call', value: SITE.phoneDisplay, href: LINKS.tel, track: 'call_click' },
  { icon: WhatsAppIcon, label: 'WhatsApp', value: SITE.phoneDisplay, href: LINKS.whatsapp, track: 'whatsapp_click', external: true },
  { icon: Mail, label: 'Email', value: SITE.emailService, href: LINKS.mailService, track: 'email_click' },
];

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Talk to Diesel Dynamix" intro="Four ways to reach us, all one tap away." crumbs={[{ name: 'Contact', path: '/contact' }]} />
      <section className="py-section">
        <div className="container grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <ul className="grid gap-4">
              {CHANNELS.map((c, i) => (
                <Reveal as="li" key={c.label} delay={i * 70}>
                  <a
                    href={c.href}
                    data-track={c.track}
                    {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="card group flex items-center gap-4 !p-5 transition-transform hover:-translate-y-0.5"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-charcoal text-amber">
                      <c.icon className="h-6 w-6" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-muted">{c.label}</span>
                      <span className="block break-words font-display text-2xl font-bold group-hover:text-amber-ink">{c.value}</span>
                    </span>
                  </a>
                </Reveal>
              ))}
              <Reveal as="li" delay={300} className="flex items-center gap-3 px-2 text-muted">
                <MapPin className="h-5 w-5 text-amber-ink" aria-hidden /> Mobile service across Southern California
              </Reveal>
            </ul>
          </div>
          <Reveal delay={100} className="rounded-xl bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-display-md">Send us a message</h2>
            <p className="mt-2 text-muted">For bookings, the <a href="/book" className="font-semibold text-amber-ink underline underline-offset-4">booking form</a> is fastest.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
