import { Section } from '@/components/primitives/Section';
import { SectionTitle } from '@/components/primitives/SectionTitle';

export default function AboutPage() {
  return (
    <Section>
      <SectionTitle>About</SectionTitle>
      <div className="max-w-4xl space-y-8 text-white/85 animate-fade-up">
        <p className="text-xl md:text-2xl font-semibold tracking-tight text-white/90 leading-relaxed">
          OffSeason is a premium athlete-led media brand that documents how elite performers
          train, recover, and build between seasons — because in a world of instant gratification,
          the off season is what separates the average from the great.
        </p>

        <p className="leading-relaxed">
          The season is the headline. The offseason is the story — training blocks, rehab rooms,
          family routines, and the meetings where contracts and careers take shape. We document it
          with a cinematic eye and a deliberate pace: behavior over slogans, context over hype.
        </p>

        <p className="leading-relaxed">
          Each season releases in weekly episodes and resolves as a premium film. The Standard
          stays the same every year:{' '}
          <span className="text-white font-semibold">Body. Mind. Ownership.</span>
        </p>
      </div>
    </Section>
  );
}
