import { Section } from '@/components/primitives/Section';
import { SectionTitle } from '@/components/primitives/SectionTitle';
import Image from 'next/image';

export default function ProjectsPage() {
  return (
    <Section contained={false}>
      <div className="mx-auto w-full max-w-4xl">
        <div className="animate-fade-up w-full md:w-1/2 md:mx-auto text-left md:ml-[150px]">
          <SectionTitle className="mb-1 md:mb-2">Projects</SectionTitle>
          <div className="text-xs uppercase tracking-[0.2em] text-white/60">Season One</div>
        </div>

        <div className="mt-3 mb-12 animate-fade-up w-full md:w-1/2 md:mx-auto">
          <div className="relative w-full">
            <Image
              src="/offPromo.jpg"
              alt="Off Season promo"
              width={800}
              height={450}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="h-auto w-full rounded-2xl"
            />
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <PlatformLink
              href="https://www.primevideo.com/detail/0KAQ8SZY6AVNA4APEEB0DVRVTD/ref=atv_sr_fle_c_sr62ef6f_1_1_1?sr=1-1&pageTypeIdSource=ASIN&pageTypeId=B0G34N65JK&qid=1772042888567"
              platform="Prime Video"
              iconSrc="/prime.png"
            />
            <PlatformLink
              href="https://tubitv.com/series/300018933/offseason"
              platform="Tubi"
              iconSrc="/tubiLogo.png"
              iconClassName="h-9 w-12"
            />
            <PlatformLink
              href="https://therokuchannel.roku.com/details/7f313c8026b1e25ae5ec7054095f18d5/offeseason"
              platform="Roku"
              iconSrc="/rokuLogo.png"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

function PlatformLink({
  href,
  platform,
  iconSrc,
  iconClassName
}: {
  href: string;
  platform: string;
  iconSrc: string;
  iconClassName?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 border border-white/15 bg-black/20 backdrop-blur-sm px-4 py-3 text-sm uppercase tracking-[0.2em] text-white/85 transition hover:border-white/30 hover:text-white"
      aria-label={`Watch now on ${platform}`}
    >
      <span className={`relative ${iconClassName ?? 'h-8 w-10'}`}>
        <Image
          src={iconSrc}
          alt={platform}
          fill
          sizes="40px"
          className="object-contain"
        />
      </span>
      <span>Watch Now</span>
    </a>
  );
}
