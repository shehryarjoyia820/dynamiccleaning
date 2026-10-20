import Link from 'next/link';
import { PageHero } from '@/components/blocks';
import { PageBody } from '@/components/page-parts';
import { pageMeta } from '@/components/seo';
import { DISCLAIMER, LINKS, SITE } from '@/lib/site';

export const metadata = pageMeta({
  title: 'Disclaimer',
  description: 'Diesel Dynamix is an independent testing provider, not CARB. Website information is general guidance, not legal advice.',
  path: '/disclaimer',
});

export default function DisclaimerPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Disclaimer" intro="Last updated October 20, 2026" crumbs={[{ name: 'Disclaimer', path: '/disclaimer' }]}>
        <span />
      </PageHero>
      <PageBody aside={<span />}>
        <h2>Independent provider</h2>
        <p>{DISCLAIMER} We are not affiliated with, endorsed by, or acting on behalf of CARB, the California DMV or any government agency.</p>
        <h2>General information, not legal advice</h2>
        <p>
          Our articles, FAQs and guides explain Clean Truck Check in plain language. Program rules, deadlines, fees and exemptions are set by CARB and can change. Always confirm your
          obligations on <a href={LINKS.carbCtc} target="_blank" rel="noopener noreferrer">CARB’s official website</a> and in CTC-VIS. Nothing on this site is legal advice.
        </p>
        <h2>Test results</h2>
        <p>Results depend on the condition of each vehicle. We cannot guarantee that a vehicle will pass.</p>
        <h2>Advertising</h2>
        <p>
          Some pages may show ads from third parties such as Google. Ads are selected by the ad network, and showing an ad does not mean we endorse the advertiser, product or
          service.
        </p>
        <h2>External links</h2>
        <p>We link to other websites for convenience. We are not responsible for their content or privacy practices.</p>
        <h2>Contact</h2>
        <p>
          Questions? <a href={LINKS.mailService}>{SITE.emailService}</a> · <Link href="/terms">Terms of Use</Link> · <Link href="/privacy">Privacy Policy</Link>
        </p>
      </PageBody>
    </>
  );
}
