import Link from 'next/link';
import { Clock, Cpu, Eye, Gauge, MapPin, Users } from 'lucide-react';
import { CtaBand, PageHero, Reveal, SectionHeading } from '@/components/blocks';
import { JsonLd, pageMeta, serviceSchema } from '@/components/seo';

export const metadata = pageMeta({
  title: 'Mobile CARB Testing Southern California | On-Site Clean Truck Check',
  description:
    'Mobile CARB testing anywhere in Southern California: on-site Clean Truck Check with mobile OBD testing, mobile smoke tests and visual inspections at your yard. Mobile diesel emissions testing for every truck.',
  path: '/mobile-testing-services',
});

// Keep this list to the test types Diesel Dynamix is credentialed and equipped for.
const TESTS = [
  {
    icon: Cpu,
    title: 'Mobile OBD testing',
    href: '/obd-testing',
    who: '2013+ diesel and 2018+ alternative-fuel engines',
    text: 'We connect to the truck’s on-board diagnostics and capture the data the program requires. Quick, clean and done right at your truck.',
  },
  {
    icon: Gauge,
    title: 'Mobile smoke test',
    href: '/smoke-opacity-test',
    who: '2012 and older diesel engines without OBD',
    text: 'A snap-acceleration smoke opacity test measures how much soot the engine emits, combined with a visual inspection.',
  },
  {
    icon: Eye,
    title: 'Visual inspection',
    href: '/smoke-opacity-test',
    who: 'Older engines and alternative-fuel vehicles without OBD',
    text: 'We check that the required emissions-control components are present, connected and undamaged.',
  },
];

const BENEFITS = [
  { icon: MapPin, title: 'No trip to a shop', text: 'We test where your trucks already are, anywhere in Southern California.' },
  { icon: Clock, title: 'Less downtime', text: 'Tests are scheduled around your loads, so trucks stay earning.' },
  { icon: Users, title: 'One contact for every truck', text: 'From a single rig to a full fleet, one team handles scheduling and follow-up.' },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={serviceSchema()} />
      <PageHero
        eyebrow="Mobile testing services"
        title="Mobile CARB testing in Southern California"
        intro="On-site Clean Truck Check at your location: mobile truck emissions testing at your yard, jobsite or terminal across Southern California."
        crumbs={[{ name: 'Mobile Testing Services', path: '/mobile-testing-services' }]}
      />
      <section className="py-section">
        <div className="container">
          <SectionHeading eyebrow="What we test on-site" title="The right test for every truck" intro="Not sure which test you need? Send us the engine model year or VIN and we will tell you." />
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTS.map((t, i) => (
              <Reveal as="li" key={t.title} delay={i * 100} className="card group transition-transform duration-300 hover:-translate-y-1">
                <t.icon className="h-10 w-10 text-accent-ink transition-transform group-hover:scale-110" aria-hidden />
                <h3 className="mt-4 text-3xl">{t.title}</h3>
                <p className="mt-1 text-sm font-semibold text-green-ink">{t.who}</p>
                <p className="mt-3 text-muted">{t.text}</p>
                <Link href={t.href} className="mt-4 inline-block font-semibold text-accent-ink underline underline-offset-4">Learn more<span className="sr-only"> about {t.title.toLowerCase()}</span></Link>
              </Reveal>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">
            Test methods are set by CARB. See <Link href="/clean-truck-check" className="font-semibold text-accent-ink underline underline-offset-4">Clean Truck Check explained</Link> for the full requirements table.
          </p>
        </div>
      </section>
      <section className="bg-charcoal py-section text-white">
        <div className="container">
          <SectionHeading dark eyebrow="The benefits" title="Why fleets choose mobile testing" />
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {BENEFITS.map((b, i) => (
              <Reveal as="li" key={b.title} delay={i * 100} className="card-dark">
                <b.icon className="h-9 w-9 text-accent" aria-hidden />
                <h3 className="mt-4 text-2xl">{b.title}</h3>
                <p className="mt-2 text-white/80">{b.text}</p>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-10 flex flex-wrap gap-4">
            <Link href="/how-testing-works" className="btn-primary">How testing works</Link>
            <Link href="/fleet-testing" className="btn-ghost-dark">Fleet testing</Link>
          </Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
