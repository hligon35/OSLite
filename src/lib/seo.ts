import type { Metadata } from 'next';

export const SITE_NAME = 'OffSeason';

// Keep descriptions short (< 160 chars) for SERP snippets.
export const DEFAULT_DESCRIPTION =
  'Premium athlete-led media documenting how elite performers train, recover, and build between seasons.';

export const DEFAULT_KEYWORDS: string[] = [
  'OffSeason',
  'athlete-led media',
  'sports documentary',
  'sports culture',
  'training and recovery',
  'off season training',
  'premium film series'
];

export function getSiteUrl(): string {
  // Prefer a public URL if provided; fall back to localhost for dev/build.
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    'http://localhost:3000';

  try {
    return new URL(raw).toString().replace(/\/$/, '');
  } catch {
    return 'http://localhost:3000';
  }
}

export function absoluteUrl(pathname: string): string {
  const base = getSiteUrl();
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

export function buildPageMetadata(params: {
  title: string;
  description?: string;
  pathname: string;
  keywords?: string[];
}): Metadata {
  const description = params.description ?? DEFAULT_DESCRIPTION;
  const keywords = params.keywords ?? DEFAULT_KEYWORDS;

  return {
    title: params.title,
    description,
    keywords,
    alternates: {
      canonical: params.pathname
    },
    openGraph: {
      title: params.title,
      description,
      url: params.pathname,
      siteName: SITE_NAME,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: params.title,
      description
    }
  };
}
