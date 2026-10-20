import { PageHero } from '@/components/blocks';
import { PageBody } from '@/components/page-parts';
import { pageMeta } from '@/components/seo';
import { LINKS, SITE } from '@/lib/site';

export const metadata = pageMeta({
  title: 'Accessibility Statement',
  description: 'Diesel Dynamix aims to meet WCAG 2.1 AA so everyone can use our website. Tell us if anything is hard to use.',
  path: '/accessibility',
});

export default function AccessibilityPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Accessibility Statement" intro="Last updated October 20, 2026" crumbs={[{ name: 'Accessibility', path: '/accessibility' }]}>
        <span />
      </PageHero>
      <PageBody aside={<span />}>
        <h2>Our commitment</h2>
        <p>We want everyone to be able to book testing and find information on our website. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 level AA.</p>
        <h2>What we do</h2>
        <ul>
          <li>Color contrast that meets WCAG AA for text and buttons.</li>
          <li>Full keyboard navigation with visible focus outlines.</li>
          <li>Text alternatives for images and labelled form fields.</li>
          <li>Reduced motion: animations switch off if your device asks for less motion.</li>
          <li>Every page offers phone and WhatsApp alternatives to online forms.</li>
        </ul>
        <h2>Need help or found a problem?</h2>
        <p>
          Call <a href={LINKS.tel}>{SITE.phoneDisplay}</a> or email <a href={LINKS.mailService}>{SITE.emailService}</a>. We will help you book by phone and fix the issue as soon as
          we can.
        </p>
      </PageBody>
    </>
  );
}
