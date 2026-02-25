import { Section } from '@/components/primitives/Section';
import { SectionTitle } from '@/components/primitives/SectionTitle';
import { TeamGrid } from '@/components/team/TeamGrid';
import { founders } from '@/data/founders';
import Image from 'next/image';

export default function FoundersPage() {
  return (
    <Section contained={false}>
      <div className="border border-white/10 bg-black/80 backdrop-blur-sm p-6 md:p-10">
        <SectionTitle>Founders</SectionTitle>
        <TeamGrid founders={founders} />
      </div>

      <div className="mt-10 flex flex-col items-center justify-center">
        <div className="text-xs uppercase tracking-[0.2em] text-white/60">Partners</div>

        <a
          href="https://maverickmediagrp.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Maverick Media Group"
          className="mt-5 inline-flex items-center justify-center gap-2 transition hover:opacity-90 md:gap-3"
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
      </div>
    </Section>
  );
}
