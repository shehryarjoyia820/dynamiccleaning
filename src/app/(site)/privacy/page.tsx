import { PageHero } from '@/components/blocks';
import { PageBody } from '@/components/page-parts';
import { pageMeta } from '@/components/seo';
import { LINKS, SITE } from '@/lib/site';

export const metadata = pageMeta({
  title: 'Privacy Policy',
  description: 'How Diesel Dynamix collects, uses and protects your personal information, including your rights under California law.',
  path: '/privacy',
});

// Template text: have it reviewed by the client's legal counsel before launch.
export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" intro="Last updated October 20, 2026" crumbs={[{ name: 'Privacy Policy', path: '/privacy' }]}>
        <span />
      </PageHero>
      <PageBody aside={<span />}>
        <h2>Who we are</h2>
        <p>
          {SITE.name} (“we”, “us”) provides mobile Clean Truck Check testing in Southern California. This policy explains what personal information we collect through dieseldynamix.com and how we use it.
        </p>
        <h2>Information we collect</h2>
        <ul>
          <li><strong>Information you give us:</strong> name, company, phone, email, truck count, truck location, engine type, preferred date and any notes or messages you send.</li>
          <li><strong>Technical information:</strong> a one-way hashed version of your IP address for spam and abuse prevention.</li>
          <li><strong>Analytics:</strong> if you accept analytics cookies, Google Analytics collects usage data such as pages visited and device type.</li>
        </ul>
        <h2>How we use it</h2>
        <ul>
          <li>To respond to your request, schedule and perform testing, and send confirmations.</li>
          <li>To keep records of the services we provide.</li>
          <li>To protect our forms from spam and abuse.</li>
          <li>To understand and improve how our website is used (only with your consent).</li>
        </ul>
        <p>We do not sell or share your personal information for cross-context behavioral advertising.</p>
        <h2>Who we share it with</h2>
        <p>
          Service providers that help us run our business, such as website hosting, database, email delivery, spam protection and analytics providers, under contracts that limit their use of
          your information. We may also disclose information if required by law.
        </p>
        <h2>Your California privacy rights</h2>
        <p>
          California residents have the right to know what personal information we collect, to request deletion or correction, and to opt out of the sale or sharing of personal information. We will not
          discriminate against you for using these rights. To make a request, email <a href={LINKS.mailInfo}>{SITE.emailInfo}</a> or call <a href={LINKS.tel}>{SITE.phoneDisplay}</a>.
        </p>
        <h2>Cookies</h2>
        <p>We only set analytics cookies if you click “Accept” on our cookie notice. You can change your choice by clearing this site’s data in your browser.</p>
        <h2>Data retention and security</h2>
        <p>We keep lead and customer records only as long as needed for the purposes above and for legal and accounting requirements. Access to our admin system is restricted and protected with two-factor authentication.</p>
        <h2>Contact</h2>
        <p>Questions about this policy? Email <a href={LINKS.mailInfo}>{SITE.emailInfo}</a>.</p>
      </PageBody>
    </>
  );
}
