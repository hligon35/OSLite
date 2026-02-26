import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Section } from '@/components/primitives/Section';
import { ProjectDetail } from '@/components/projects/ProjectDetail';
import { getProjectBySlug, projects } from '@/data/projects';
import { buildPageMetadata } from '@/lib/seo';

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return buildPageMetadata({
      title: 'Project',
      description: 'Project details from OffSeason.',
      pathname: `/projects/${slug}`
    });
  }

  return buildPageMetadata({
    title: project.title,
    description: project.logline,
    pathname: `/projects/${project.slug}`,
    keywords: [
      'OffSeason project',
      project.title,
      project.platform,
      project.format,
      String(project.releaseYear)
    ]
  });
}

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <Section>
      <ProjectDetail project={project} />
    </Section>
  );
}
