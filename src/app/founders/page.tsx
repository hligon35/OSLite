import { Section } from '@/components/primitives/Section';
import { SectionTitle } from '@/components/primitives/SectionTitle';
import { TeamGrid } from '@/components/team/TeamGrid';
import { founders } from '@/data/founders';
import Image from 'next/image';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Founders',
  description:
    'Meet the founders behind OffSeason — a premium athlete-led media studio focused on cinematic storytelling and craft.',
  pathname: '/founders',
  keywords: ['OffSeason founders', 'sports media studio', 'creative director', 'producer']
});

export default function FoundersPage() {
  return (
    <Section contained={false}>
      <div className="mx-auto w-full max-w-4xl">
        <SectionTitle>Founders</SectionTitle>
        <TeamGrid founders={founders.slice(0, 1)} />
      </div>

      <div className="mt-10 flex flex-col items-center justify-center">
        <div className="text-xs uppercase tracking-[0.2em] text-white/60">Partners</div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-6">
          <a
            href="https://maverickmediagrp.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Maverick Media Group"
            className="inline-flex items-center justify-center gap-2 transition hover:opacity-90 md:gap-3"
          >
            <Image
              src="/MMGwing.svg"
              alt="MMG Wing"
              width={260}
              height={120}
              className="h-16 w-auto md:h-20"
              priority
            />
            <Image
              src="/MAVERICK.svg"
              alt="Maverick"
              width={260}
              height={120}
              className="h-16 w-auto md:h-20"
              priority
            />
          </a>

          <a
            href="https://www.bigmedia.tv/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Big Media"
            className="inline-flex items-center justify-center transition hover:opacity-90"
          >
            <Image
              src="/bigMedia.webp"
              alt="Big Media"
              width={260}
              height={120}
              className="h-32 w-auto md:h-40"
            />
          </a>
        </div>
      </div>
    </Section>
  );
}
