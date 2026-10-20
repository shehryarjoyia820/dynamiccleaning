import { CtaBand, PageHero } from '@/components/blocks';
import { Checklist, PageBody } from '@/components/page-parts';
import { pageMeta } from '@/components/seo';
import { SITE } from '@/lib/site';

export const metadata = pageMeta({
  title: 'About Us',
  description: `Diesel Dynamix is a mobile Clean Truck Check testing company led by CEO ${SITE.ceo}, serving owner-operators and fleets across California.`,
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Diesel Dynamix"
        title="Compliance testing that comes to the truck"
        intro="We started Diesel Dynamix for one reason: trucks earn money on the road, not waiting in line for a test."
        crumbs={[{ name: 'About', path: '/about' }]}
      />
      <PageBody>
        <h2>Our story</h2>
        <p>
          California’s Clean Truck Check program means hundreds of thousands of heavy-duty trucks need regular emissions tests. For owner-operators and fleet managers, that often means
          pulling a truck off a route, driving to a test site and waiting. Diesel Dynamix was built to remove that downtime. We bring the test to your yard, jobsite or terminal.
        </p>
        <h2>Led by {SITE.ceo}</h2>
        <p>
          Diesel Dynamix is led by CEO {SITE.ceo}, who built the company around a simple promise: answer the phone, show up on time and explain results in plain English. Whether you run one
          truck or a hundred, you deal with people who understand trucking and respect your schedule.
        </p>
        <h2>Our mobile approach</h2>
        <Checklist
          items={[
            <><strong>We travel statewide.</strong> From San Diego to Eureka, our testers come to where your trucks park.</>,
            <><strong>We work around dispatch.</strong> Early starts and fleet visits are planned so trucks rotate through without missing loads.</>,
            <><strong>We keep it simple.</strong> Clear pricing, clear results and clear next steps, with no jargon.</>,
            <><strong>We stay independent.</strong> We are a private testing service, not CARB, and we always point you to official sources for program rules.</>,
          ]}
        />
        <h2>Our commitment</h2>
        <p>
          Every customer gets fast replies, honest advice and a test done right the first time. If something needs repair before a truck can pass, we tell you what it means and help you
          plan a retest.
        </p>
      </PageBody>
      <CtaBand />
    </>
  );
}
