import { Section } from '@/components/primitives/Section';
import { SectionTitle } from '@/components/primitives/SectionTitle';

export default function AboutPage() {
  return (
    <Section>
      <SectionTitle>About</SectionTitle>
      <div className="max-w-3xl space-y-8 text-white/85 animate-fade-up">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-wide text-white">Studio mission</h3>
          <p className="leading-relaxed">
            We build modern, cinematic work that respects the craft — clean typography, deliberate
            pacing, and uncompromising composition.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-wide text-white">Philosophy</h3>
          <p className="leading-relaxed">
            Minimal, high-contrast, whitespace-heavy design. Every element earns its place.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-wide text-white">Storytelling approach</h3>
          <p className="leading-relaxed">
            We lead with story and tone. Mood, momentum, and detail — designed to feel inevitable.
          </p>
        </div>
      </div>
    </Section>
  );
}
