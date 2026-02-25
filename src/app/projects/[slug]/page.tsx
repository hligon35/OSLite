import { notFound } from 'next/navigation';
import { Section } from '@/components/primitives/Section';
import { ProjectDetail } from '@/components/projects/ProjectDetail';
import { getProjectBySlug } from '@/data/projects';

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
