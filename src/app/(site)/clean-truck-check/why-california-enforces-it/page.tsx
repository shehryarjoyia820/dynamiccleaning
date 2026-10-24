import { CtaBand, OfficialSourceNote, PageHero } from '@/components/blocks';
import { PageBody } from '@/components/page-parts';
import { pageMeta } from '@/components/seo';
import { SeoExtras } from '@/components/seo-extras';

export const metadata = pageMeta({
  title: 'California Truck Emissions Regulations: Why Clean Truck Check Is Enforced',
  description:
    'Why California requires heavy-duty truck emissions testing: air quality goals, diesel emissions, roadside monitoring and the consequences of non-compliance.',
  path: '/clean-truck-check/why-california-enforces-it',
});

export default function WhyPage() {
  return (
    <>
      <PageHero
        eyebrow="Why California enforces it"
        title="Why California enforces Clean Truck Check"
        intro="Heavy-duty trucks are a small share of vehicles on California roads but a large share of smog-forming and diesel particulate emissions."
        crumbs={[
          { name: 'Clean Truck Check Explained', path: '/clean-truck-check' },
          { name: 'Why California Enforces It', path: '/clean-truck-check/why-california-enforces-it' },
        ]}
      />
      <PageBody>
        <p>
          Clean Truck Check is one of several California truck emissions regulations run by CARB. Here is why the state enforces it, and what it means for your trucks.
        </p>
        <h2>Air quality goals</h2>
        <p>
          Several California regions, including the South Coast and San Joaquin Valley, have some of the most persistent air quality problems in the country. To meet state and
          federal clean-air standards, California needs the emissions-control systems already built into modern trucks to keep working throughout their lives.
        </p>
        <h2>Why diesel emissions matter</h2>
        <p>
          Diesel exhaust contains nitrogen oxides (NOx), which form smog, and fine particulate matter, which is linked to respiratory and heart disease. Communities near ports,
          freeways and distribution centers are most exposed. A truck with a failed filter or a disabled emissions system can emit many times more than one that is working as designed.
        </p>
        <h2>Roadside monitoring</h2>
        <p>
          CARB uses roadside emissions monitoring and other screening tools to spot trucks that may be high-emitting. Flagged vehicles can be required to prove compliance
          or get repairs. Keeping your trucks tested and maintained is the simplest way to avoid surprises.
        </p>
        <h2>Consequences of non-compliance</h2>
        <ul>
          <li>Vehicles that are out of compliance can face registration holds with the California DMV.</li>
          <li>Out-of-state and fleet vehicles can be subject to citations and penalties.</li>
          <li>Unrepaired emissions faults usually mean bigger repair bills later.</li>
        </ul>
        <p>
          Penalty amounts and enforcement procedures are set by CARB and can change. Check the official program pages for current details.
        </p>
        <h2>The upside for truck owners</h2>
        <p>
          A truck whose emissions system works properly usually runs better, with fewer derates and less unplanned downtime. Regular testing catches problems early, when they are cheaper to fix.
        </p>
        <div className="not-prose mt-8">
          <OfficialSourceNote />
        </div>
      </PageBody>
      <SeoExtras path={'/clean-truck-check/why-california-enforces-it'} />
      <CtaBand />
    </>
  );
}
