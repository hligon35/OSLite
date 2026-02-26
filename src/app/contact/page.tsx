import { Section } from '@/components/primitives/Section';
import { SectionTitle } from '@/components/primitives/SectionTitle';
import { ContactForm } from '@/components/contact/ContactForm';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import Image from 'next/image';

export const metadata: Metadata = buildPageMetadata({
  title: 'Contact',
  description:
    'Contact OffSeason to discuss projects, partnerships, and production. Send a message and we’ll respond with next steps.',
  pathname: '/contact',
  keywords: [
    'contact OffSeason',
    'sports media production contact',
    'partnership inquiries',
    'documentary production'
  ]
});

export default function ContactPage() {
  return (
    <Section>
      <SectionTitle>Contact</SectionTitle>
      <div className="grid gap-10 md:grid-cols-2 animate-fade-up">
        <ContactForm />
        <div className="text-white/85 flex h-full flex-col gap-4">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-white/60">Direct</div>
            <div className="mt-2 space-y-1">
              <div>
                <span className="text-white/60">Email:</span> info@off-season.io
              </div>
            </div>
          </div>
          <p className="leading-relaxed">
            Enter the Off Season Framework
            Every project begins with a story, a theme, and a standard.
            Tell us what you’re creating and why it matters.
            Our team will follow up with a guided intake and outline how your work could fit within our annual architecture.
          </p>

          <div className="flex flex-1 items-center justify-center">
            <Image
              src="/offseasonlogo.png"
              alt="OffSeason"
              width={400}
              height={120}
              sizes="400px"
              className="h-20 w-auto opacity-90"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
