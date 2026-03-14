import { Section } from '@/components/primitives/Section';
import { SectionTitle } from '@/components/primitives/SectionTitle';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'About',
  description:
    'Learn about OFFSEASON — a premium athlete-led media brand documenting training, recovery, and the work between seasons.',
  pathname: '/about',
  keywords: [
    'about OFFSEASON',
    'athlete-led media',
    'sports documentary',
    'training and recovery storytelling'
  ]
});

export default function AboutPage() {
  return (
    <Section>
      <SectionTitle>About</SectionTitle>
      <div className="max-w-4xl space-y-8 text-white/85 animate-fade-up">
        <p className="text-xl md:text-2xl font-semibold tracking-tight text-white/90 leading-relaxed">
          OFFSEASON is a premium athlete-led media brand that documents how elite performers
          train, recover, and build between seasons — because in a world of instant gratification,
          the off season is what separates the average from the great.
        </p>

        <p className="font-normal leading-relaxed">
          Through premium storytelling and athlete collaboration, OFFSEASON explores three
          pillars that define elite competitors today:
        </p>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Body</h2>
            <p className="font-normal leading-relaxed">Training, recovery, and longevity.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">Mind</h2>
            <p className="font-normal leading-relaxed">Discipline, resilience, and reinvention.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">Ownership</h2>
            <p className="font-normal leading-relaxed">
              Contracts, investments, entrepreneurship, and long-term wealth.
            </p>
          </div>
        </div>

        <p className="font-normal leading-relaxed">
          By studying these cycles across professional sports, OFFSEASON reveals how modern
          athletes are evolving from performers into builders, investors, and leaders beyond the
          game.
        </p>

        <p className="font-normal leading-relaxed">Because the off season isn’t just part of the calendar.</p>

        <p className="leading-relaxed text-white font-semibold">
          It’s where the foundation for greatness is built.
        </p>
      </div>
    </Section>
  );
}
