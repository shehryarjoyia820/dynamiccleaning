import Link from 'next/link';
import { ArrowRight, Building2, CalendarClock, MapPinned, Truck, UserRound, Warehouse } from 'lucide-react';
import { CtaBand, FaqList, Reveal, RequirementsTable, SectionHeading } from '@/components/blocks';
import { CaliforniaMap } from '@/components/california-map';
import { CityTicker } from '@/components/home/city-ticker';
import { MobileVsShop } from '@/components/home/compare';
import { HeroSlider } from '@/components/home/hero-slider';
import { Counters, HowItWorks } from '@/components/home/interactive';
import { JsonLd, faqSchema, pageMeta, serviceSchema } from '@/components/seo';
import { PORTS } from '@/content/ports';
import { REGIONS } from '@/content/seed';
import { getFaqs, getServiceAreas, getSettings } from '@/lib/content';
import { SeoExtras } from '@/components/seo-extras';
import { SITE } from '@/lib/site';
import { pageSeo, withSeoFaqs } from '@/lib/page-seo';

export const revalidate = 300;

// Home title/description come from the keyword research when set (page-seo.json), else the site default.
export const metadata = pageSeo('/')?.title
  ? pageMeta({ title: pageSeo('/')!.title!, description: pageSeo('/')!.description ?? SITE.description, path: '/' })
  : { alternates: { canonical: '/' } };

const TRUST = [
  { icon: MapPinned, title: 'Southern California', text: 'LA, OC, Inland Empire, San Diego' },
  { icon: Truck, title: 'Mobile on-site service', text: 'We test at your yard or jobsite' },
  { icon: CalendarClock, title: 'Fleet-friendly scheduling', text: 'Built around your dispatch' },
];

const AUDIENCES = [
  {
    icon: UserRound,
    title: 'Owner-operators',
    text: 'One truck, one call. We meet you where you park and get you back on the road without a trip to a shop.',
    href: '/services',
  },
  {
    icon: Building2,
    title: 'Small carriers',
    text: 'Test a handful of trucks in one visit and keep every deadline in view without adding admin work.',
    href: '/services/how-testing-works',
  },
  {
    icon: Warehouse,
    title: 'Large fleets',
    text: 'Multi-truck scheduling, recurring testing plans and a single point of contact across your locations.',
    href: '/services/fleet-testing',
  },
];

export default async function HomePage() {
  const [areas, faqs, settings] = await Promise.all([getServiceAreas(), getFaqs(), getSettings()]);
  const preview = faqs.slice(0, 5);

  return (
    <>
      <JsonLd data={serviceSchema()} />
      <JsonLd data={faqSchema(withSeoFaqs('/', preview))} />
      <HeroSlider />

      {/* Trust bar */}
      <section aria-label="Why Diesel Dynamix" className="relative z-10 -mt-16 sm:-mt-12">
        <div className="container">
          <ul className="grid gap-px overflow-hidden rounded-xl bg-white/10 shadow-lift sm:grid-cols-3">
            {TRUST.map((t, i) => (
              <Reveal as="li" key={t.title} delay={i * 90} className="flex items-center gap-4 bg-steel p-5 text-white sm:p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                  <t.icon className="h-6 w-6" aria-hidden />
                </span>
                <span>
                  <span className="block font-display text-xl font-bold uppercase">{t.title}</span>
                  <span className="text-sm text-muted-dark">{t.text}</span>
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-12">
        <CityTicker areas={areas} />
      </div>

      {/* What is Clean Truck Check */}
      <section className="py-section">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="The program in plain English" title="What is Clean Truck Check?" />
            <Reveal delay={100} className="mt-6 space-y-4 text-lg text-ink/85">
              <p>
                Clean Truck Check is California’s emissions testing program for heavy-duty trucks, run by the California Air Resources Board (CARB).
              </p>
              <p>Most diesel and alternative-fuel trucks over 14,000 lb that drive in California, including out-of-state trucks, must pass periodic tests.</p>
              <p>
                <strong>Diesel Dynamix brings the test to you</strong>, so your trucks stay compliant without leaving the yard.
              </p>
            </Reveal>
            <Reveal delay={180} className="btn-row mt-8">
              <Link href="/clean-truck-check" className="btn-primary">
                Read the full guide <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
              <Link href="/clean-truck-check/why-california-enforces-it" className="btn-ghost-light">
                Why it’s enforced
              </Link>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <RequirementsTable rows={settings.requirements} frequency={settings.frequency_text} />
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-section">
        <div className="container">
          <SectionHeading eyebrow="How our mobile service works" title="Four steps. Zero trips to a shop." center />
          <div className="mt-14">
            <HowItWorks />
          </div>
          <Reveal className="mt-12 text-center">
            <Link href="/services/how-testing-works" className="inline-flex items-center gap-2 font-display text-lg font-bold uppercase text-accent-ink hover:text-ink">
              What to have ready <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Who we serve */}
      <section className="bg-charcoal py-section text-white">
        <div className="container">
          <SectionHeading dark eyebrow="Who we serve" title="Built for the people who keep California moving" />
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {AUDIENCES.map((a, i) => (
              <Reveal as="li" key={a.title} delay={i * 100}>
                <Link
                  href={a.href}
                  className="group flex h-full flex-col rounded-xl border border-white/10 bg-steel p-7 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-accent/60"
                >
                  <a.icon className="h-10 w-10 text-accent transition-transform duration-300 group-hover:scale-110" aria-hidden />
                  <h3 className="mt-5 text-3xl">{a.title}</h3>
                  <p className="mt-3 flex-1 text-white/80">{a.text}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-display font-bold uppercase text-accent">
                    Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <MobileVsShop />

      {/* Southern California coverage */}
      <section className="relative overflow-hidden bg-[#0F141B] py-section text-white">
        <div className="container grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <CaliforniaMap areas={areas} className="mx-auto w-full max-w-md" />
          <div>
            <SectionHeading
              dark
              eyebrow="Clean Truck Check near me"
              title="Anywhere in Southern California"
              intro="Searching for Clean Truck Check near you? Our mobile testers cover Southern California, from the Ports of Los Angeles and Long Beach to the Inland Empire, San Diego and the Imperial Valley. Pick your city, or just tell us where your trucks are."
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {REGIONS.map((r, i) => (
                <Reveal key={r} delay={i * 80}>
                  <h3 className="text-xl text-accent">{r}</h3>
                  <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                    {areas
                      .filter((a) => a.region === r)
                      .map((a) => (
                        <li key={a.slug}>
                          <Link href={`/service-areas/${a.slug}`} className="text-white/80 underline-offset-4 hover:text-white hover:underline">
                            {a.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </Reveal>
              ))}
              <Reveal delay={320}>
                <h3 className="text-xl text-accent">Ports</h3>
                <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  {PORTS.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/service-areas/ports/${p.slug}`} className="text-white/80 underline-offset-4 hover:text-white hover:underline">
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <div className="mt-10">
              <Counters items={settings.counters.map((c) => (/cities/i.test(c.label) ? { ...c, value: areas.length } : c))} dark />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="py-section">
        <div className="container grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeading eyebrow="FAQ" title="Questions we hear every day" intro="Straight answers about the program and our mobile service." />
            <Reveal delay={120} className="mt-8">
              <Link href="/clean-truck-check/faq" className="btn-ghost-light">
                See all FAQs <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <FaqList faqs={preview} />
          </Reveal>
        </div>
      </section>

      <SeoExtras path={'/'} schema={false} />
      <CtaBand />
    </>
  );
}
