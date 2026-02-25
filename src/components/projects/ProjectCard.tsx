import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/lib/types';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden border border-white/10 bg-black/30 transition hover:border-white/25"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={project.thumbnailUrl}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover opacity-90 transition duration-300 group-hover:opacity-100 group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-5">
        <div className="text-xs uppercase tracking-[0.2em] text-white/60">
          {project.platform} · {project.format}
        </div>
        <div className="mt-2 text-xl font-semibold tracking-tight text-white">
          {project.title}
        </div>
      </div>
    </Link>
  );
}
