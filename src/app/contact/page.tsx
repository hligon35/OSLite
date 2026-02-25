import { Section } from '@/components/primitives/Section';
import { SectionTitle } from '@/components/primitives/SectionTitle';
import { ContactForm } from '@/components/contact/ContactForm';

export default function ContactPage() {
  return (
    <Section>
      <SectionTitle>Contact</SectionTitle>
      <div className="grid gap-10 md:grid-cols-2 animate-fade-up">
        <ContactForm />
        <div className="space-y-4 text-white/85">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-white/60">Direct</div>
            <div className="mt-2 space-y-1">
              <div>
                <span className="text-white/60">Email:</span> info@off-season.io
              </div>
            </div>
          </div>
          <p className="leading-relaxed">
            Tell us what you’re building. We’ll respond with next steps and availability.
          </p>
        </div>
      </div>
    </Section>
  );
}
