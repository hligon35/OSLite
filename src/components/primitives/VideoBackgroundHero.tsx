import { HeaderSpacer } from '@/components/primitives/HeaderSpacer';

export function VideoBackgroundHero({
  videoSrc,
  tagline,
  subcopy,
  align = 'center'
}: {
  videoSrc: string;
  tagline: string;
  subcopy?: string;
  align?: 'center' | 'left';
}) {
  return (
    <section className="relative h-[100dvh] w-full overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover -z-10"
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
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
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white animate-fade-up">
            {tagline}
          </h1>
          {subcopy ? (
            <p className="mt-4 max-w-2xl text-base md:text-lg text-white/80 animate-fade-up [animation-delay:120ms]">
              {subcopy}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
