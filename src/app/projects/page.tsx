import { Section } from '@/components/primitives/Section';
import { SectionTitle } from '@/components/primitives/SectionTitle';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { projects } from '@/data/projects';

export default function ProjectsPage() {
  return (
    <Section>
      <SectionTitle>Projects</SectionTitle>
      <ProjectGrid projects={projects} />
    </Section>
  );
}
