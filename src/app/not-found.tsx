import Link from 'next/link';
import type { Metadata } from 'next';
import { Section } from '@/components/primitives/Section';
import { SectionTitle } from '@/components/primitives/SectionTitle';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Not Found',
  description: 'The requested page could not be found.',
  pathname: '/404',
  keywords: ['OffSeason 404', 'page not found']
});

export default function NotFound() {
  return (
    <Section>
      <SectionTitle>Not Found</SectionTitle>
      <p className="text-white/80 animate-fade-up">That page doesn’t exist.</p>
      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center justify-center border border-white/30 px-4 py-2 text-sm uppercase tracking-[0.2em] text-white/90 transition hover:border-white/60 hover:text-white"
        >
          Return home
        </Link>
      </div>
    </Section>
  );
}
