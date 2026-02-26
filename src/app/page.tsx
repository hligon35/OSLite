import { VideoBackgroundHero } from '@/components/primitives/VideoBackgroundHero';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'OffSeason',
  description:
    'Premium athlete-led media documenting the off season — training, recovery, and ownership between the headlines.',
  pathname: '/',
  keywords: [
    'OffSeason',
    'sports documentary series',
    'athlete-led media brand',
    'off season training',
    'sports culture films'
  ]
});

export default function LandingPage() {
  return (
    <VideoBackgroundHero
      videoSrc="/offseason_(2025)_-_official_trailer.mp4"
      tagline="OFFSEASON"
      subcopy="A sports-culture institution."
      align="left"
    />
  );
}
