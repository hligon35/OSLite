import type { Project } from '@/lib/types';

export const projects: Project[] = [
  {
    id: 'p1',
    slug: 'offseason-trailer',
    title: 'Offseason',
    platform: 'Film',
    format: 'Trailer',
    logline: 'The calm before the collision.',
    synopsis:
      'A high-contrast study in momentum — where silence, pressure, and precision collide.',
    heroImageUrl: '/season2.png',
    thumbnailUrl: '/season2.png',
    releaseYear: 2025,
    featured: true,
    media: [
      {
        type: 'video',
        url: '/offseason_(2025)_-_official_trailer.mp4',
        caption: 'Official Trailer'
      }
    ],
    credits: [
      { role: 'Director', name: 'TBD' },
      { role: 'Producer', name: 'TBD' },
      { role: 'Editor', name: 'TBD' }
    ]
  },
  {
    id: 'p2',
    slug: 'rubber-room',
    title: 'Rubber Room',
    platform: 'Brand',
    format: 'Spot',
    logline: 'The mark becomes the world.',
    synopsis:
      'An exercise in iconography and restraint — minimal forms, maximal impact.',
    heroImageUrl: '/rubberLogo.png',
    thumbnailUrl: '/rubberLogo.png',
    releaseYear: 2026,
    featured: false,
    media: [
      {
        type: 'image',
        url: '/rubberLogo.png',
        caption: 'Key art'
      }
    ],
    credits: [{ role: 'Studio', name: 'Offseason' }]
  },
  {
    id: 'p3',
    slug: 'season-two',
    title: 'Season Two',
    platform: 'Series',
    format: 'Teaser',
    logline: 'A second pass — sharper, quieter, heavier.',
    synopsis:
      'A typography-forward teaser built around space, rhythm, and controlled reveal.',
    heroImageUrl: '/season2.png',
    thumbnailUrl: '/season2.png',
    releaseYear: 2026,
    featured: false,
    media: [
      {
        type: 'image',
        url: '/season2.png',
        caption: 'Still'
      }
    ],
    credits: [{ role: 'Studio', name: 'Offseason' }]
  }
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
