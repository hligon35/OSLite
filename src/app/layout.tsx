import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import type { Viewport } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  SITE_NAME,
  absoluteUrl,
  getSiteUrl
} from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: '/',
    siteName: SITE_NAME,
    images: [{ url: '/offseasonlogo.png', alt: SITE_NAME }]
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: ['/offseasonlogo.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  referrer: 'strict-origin-when-cross-origin',
  icons: {
    icon: '/OSlogo.png'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050505',
  colorScheme: 'dark'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/offseasonlogo.png'),
    sameAs: [
      'https://www.instagram.com/offseasonofc/?next=%2F',
      'https://www.tiktok.com/@offseasonlive',
      'https://x.com/offseasonofc',
      'https://www.youtube.com/@OffSeasonLive',
      'https://www.linkedin.com/company/off-season-tv/?viewAsMember=true'
    ]
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: absoluteUrl('/')
  };

  return (
    <html lang="en">
      <body>
        <JsonLd data={orgJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
