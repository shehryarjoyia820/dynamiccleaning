import { Clock, MapPinned, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/blocks';
import { BookingForm } from '@/components/forms';
import { pageMeta } from '@/components/seo';

export const metadata = pageMeta({
  title: 'Book Mobile Clean Truck Check Testing',
  description: 'Book on-site Clean Truck Check testing anywhere in California. Tell us about your trucks and we will confirm your appointment fast.',
  path: '/book',
});

export default function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Book testing"
        title="Book mobile testing"
        intro="Takes about a minute. We will confirm your appointment by phone or email."
        crumbs={[{ name: 'Book Testing', path: '/book' }]}
      >
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-white/85">
          <li className="flex items-center gap-2"><MapPinned className="h-5 w-5 text-orange" aria-hidden /> Anywhere in California</li>
          <li className="flex items-center gap-2"><Clock className="h-5 w-5 text-orange" aria-hidden /> Fast replies</li>
          <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-orange" aria-hidden /> Your details stay private</li>
        </ul>
      </PageHero>
      <section className="py-section">
        <div className="container max-w-3xl">
          <div className="rounded-xl bg-white p-6 shadow-card sm:p-10">
            <BookingForm source="book-page" />
          </div>
        </div>
      </section>
    </>
  );
}
