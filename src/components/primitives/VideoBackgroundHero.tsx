import Link from 'next/link';
import { AdaptiveBackgroundVideo } from '@/components/primitives/AdaptiveBackgroundVideo';
import { HeaderSpacer } from '@/components/primitives/HeaderSpacer';

export function VideoBackgroundHero({
  videoSrc,
  posterSrc,
  tagline,
  subcopy,
  ctas,
  align = 'center'
}: {
  videoSrc: string;
  posterSrc?: string;
  tagline: string;
  subcopy?: string;
  ctas?: Array<{ href: string; label: string; variant?: 'primary' | 'secondary' }>;
  align?: 'center' | 'left';
}) {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      <AdaptiveBackgroundVideo
        src={videoSrc}
        posterSrc={posterSrc}
        className="absolute inset-0 h-full w-full object-cover object-center -z-10"
        preload="metadata"
      />
      <div className="absolute inset-0 bg-black/35 -z-10" />
      <HeaderSpacer />
      <div className="mx-auto flex h-full max-w-6xl px-4 md:px-6">
        <div
          className={
            'flex w-full flex-col justify-center ' +
            (align === 'left' ? 'items-start text-left' : 'items-center text-center')
          }
        >
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white animate-fade-up">
            {tagline}
          </h1>
          {subcopy ? (
            <p className="mt-4 max-w-2xl text-base md:text-lg text-white/80 animate-fade-up [animation-delay:120ms]">
              {subcopy}
            </p>
          ) : null}
          {ctas?.length ? (
            <div className="mt-8 flex flex-wrap gap-3 animate-fade-up [animation-delay:180ms]">
              {ctas.map((cta) => (
                <Link
                  key={`${cta.href}-${cta.label}`}
                  href={cta.href}
                  className={
                    'inline-flex items-center justify-center border px-5 py-3 text-sm uppercase tracking-[0.2em] transition ' +
                    (cta.variant === 'secondary'
                      ? 'border-white/20 bg-black/25 text-white/90 hover:border-white/40 hover:text-white'
                      : 'border-white bg-white text-black hover:bg-transparent hover:text-white')
                  }
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
