export function FixedVideoBackground({ src }: { src: string }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <video
        className="h-full w-full object-cover object-center"
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
      <div className="absolute inset-0 bg-black/55" />
    </div>
  );
}
