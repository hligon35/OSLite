import { Section } from '@/components/primitives/Section';
import { SectionTitle } from '@/components/primitives/SectionTitle';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'About',
  description:
    'Learn about OffSeason — a premium athlete-led media brand documenting training, recovery, and the work between seasons.',
  pathname: '/about',
  keywords: [
    'about OffSeason',
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
          "In a world of instant gratification, greatness is built in the off season."
        </p>

        <p className="leading-relaxed">
          OFFSEASON is a premium athlete-owned media brand exploring the intersection of elite
          sports performance, business, and ownership.
        </p>

        <p className="leading-relaxed">
          The platform documents what happens between seasons - the period where athletes train,
          recover, reinvent themselves, and build the next phase of their careers.
        </p>

        <p className="leading-relaxed">
          Through premium storytelling and athlete collaboration, OFFSEASON explores three pillars
          that define elite competitors today:
        </p>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Body</h2>
            <p className="leading-relaxed">Training, recovery, and longevity.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">Mind</h2>
            <p className="leading-relaxed">Discipline, resilience, and reinvention.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">Ownership</h2>
            <p className="leading-relaxed">
              Contracts, investments, entrepreneurship, and long-term wealth.
            </p>
          </div>
        </div>

        <p className="leading-relaxed">
          By studying these cycles across professional sports, OFFSEASON reveals how modern
          athletes are evolving from performers into builders, investors, and leaders beyond the
          game.
        </p>

        <p className="leading-relaxed">
          Because the off season isn't just part of the calendar.
        </p>

        <p className="leading-relaxed text-white font-medium">
          It's where the foundation for greatness is built.
        </p>
      </div>
    </Section>
  );
}
