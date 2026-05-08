import { AdaptiveBackgroundVideo } from '@/components/primitives/AdaptiveBackgroundVideo';

export function FixedVideoBackground({ src, posterSrc }: { src: string; posterSrc?: string }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <AdaptiveBackgroundVideo
        src={src}
        posterSrc={posterSrc}
        className="h-full w-full object-cover object-center"
        preload="none"
      />
      <div className="absolute inset-0 bg-black/55" />
    </div>
  );
}
