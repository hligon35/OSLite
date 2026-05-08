'use client';

import { useEffect, useState } from 'react';

type NetworkInformationLike = {
  saveData?: boolean;
};

function shouldLoadAutoplayVideo() {
  if (typeof window === 'undefined') {
    return true;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  const saveData = connection?.saveData === true;

  return !prefersReducedMotion && !saveData;
}

export function AdaptiveBackgroundVideo({
  src,
  posterSrc,
  className,
  preload = 'metadata'
}: {
  src: string;
  posterSrc?: string;
  className: string;
  preload?: 'none' | 'metadata' | 'auto';
}) {
  const [videoEnabled, setVideoEnabled] = useState(false);

  useEffect(() => {
    setVideoEnabled(shouldLoadAutoplayVideo());
  }, []);

  return (
    <>
      {posterSrc ? (
        <div
          aria-hidden="true"
          className={className}
          style={{ backgroundImage: `url(${posterSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      ) : null}
      {videoEnabled ? (
        <video
          className={className}
          src={src}
          poster={posterSrc}
          autoPlay
          loop
          muted
          playsInline
          preload={preload}
          aria-hidden="true"
        />
      ) : null}
    </>
  );
}