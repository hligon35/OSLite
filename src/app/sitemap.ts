import type { MetadataRoute } from 'next';
import { projects } from '@/data/projects';
import { getSiteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 1 },
    {
      url: `${base}/projects`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6
    },
    {
      url: `${base}/founders`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5
    },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7
    }))
  ];
}
