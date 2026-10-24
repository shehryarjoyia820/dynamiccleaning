import { CalendarRange, ClipboardList, Layers, Repeat, UserRound } from 'lucide-react';
import { CtaBand, PageHero, Reveal, SectionHeading } from '@/components/blocks';
import { BookingForm } from '@/components/forms';
import { pageMeta } from '@/components/seo';

export const metadata = pageMeta({
  title: 'Fleet Clean Truck Check Testing Southern California | CARB Compliance for Fleets',
  description:
    'Fleet Clean Truck Check testing across Southern California: fleet emissions testing and fleet OBD testing at your yard, recurring CARB compliance plans for fleets and owner-operators.',
  path: '/services/fleet-testing',
});

const FEATURES = [
  { icon: Layers, title: 'Multi-truck visits', text: 'We test as many trucks as possible per visit, rotating them so dispatch keeps moving.' },
  { icon: Repeat, title: 'Recurring testing plans', text: 'We track each truck’s next window and book the visit before the deadline comes up.' },
  { icon: CalendarRange, title: 'Multiple locations', text: 'Trucks spread across several yards? We plan routes to cover them efficiently.' },
  { icon: ClipboardList, title: 'Clear reporting', text: 'You get a simple summary of every truck tested, the result and what comes next.' },
  { icon: UserRound, title: 'Owner-operators too', text: 'One truck? Owner-operator Clean Truck Check is the same simple visit, with no fleet minimums.' },
];

export default function FleetPage() {
  return (
    <>
      <PageHero
        eyebrow="Fleet testing"
        title="Fleet Clean Truck Check testing"
        intro="Fleet emissions testing in Southern California made simple: we bring OBD and smoke testing to your yard and keep every truck on track for CARB compliance."
        crumbs={[
          { name: 'Services', path: '/services' },
          { name: 'Fleet Testing', path: '/services/fleet-testing' },
        ]}
      />
      <section className="py-section">
        <div className="container">
          <SectionHeading eyebrow="CARB compliance for fleets" title="Fleet OBD testing on your schedule" />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {FEATURES.map((f, i) => (
              <Reveal as="li" key={f.title} delay={i * 80} className="card">
                <f.icon className="h-9 w-9 text-accent-ink" aria-hidden />
                <h3 className="mt-4 text-2xl">{f.title}</h3>
                <p className="mt-2 text-muted">{f.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <section className="bg-white py-section">
        <div className="container grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <SectionHeading eyebrow="Get a fleet quote" title="Tell us about your fleet" intro="Number of trucks, engine types and locations is all we need to plan the visit." />
          <Reveal delay={100} className="rounded-xl bg-offwhite p-6 sm:p-8">
            <BookingForm source="fleet-page" />
          </Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
