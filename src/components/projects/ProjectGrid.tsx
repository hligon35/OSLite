import type { Project } from '@/lib/types';
import { ProjectCard } from '@/components/projects/ProjectCard';

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-up">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}
