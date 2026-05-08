'use client';

import { usePathname } from 'next/navigation';
import { FixedVideoBackground } from '@/components/primitives/FixedVideoBackground';

export function RouteBackground() {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  return (
    <FixedVideoBackground
      src="/offseason_(2025)_-_official_trailer.mp4"
      posterSrc="/offPromo.jpg"
    />
  );
}