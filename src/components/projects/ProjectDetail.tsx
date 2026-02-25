import Image from 'next/image';
import type { Project } from '@/lib/types';

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <div className="space-y-12">
      <div className="space-y-5">
        <div className="relative aspect-[21/9] w-full overflow-hidden border border-white/10 bg-black/30">
          <Image
            src={project.heroImageUrl}
            alt={project.title}
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="space-y-2 animate-fade-up">
          <div className="text-xs uppercase tracking-[0.2em] text-white/60">
            {project.platform} · {project.format} · {project.releaseYear}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            {project.title}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed">
            {project.logline}
          </p>
        </div>
      </div>

      <div className="grid gap-12 md:grid-cols-3 animate-fade-up">
        <div className="md:col-span-2 space-y-8">
          <div className="space-y-3">
            <h2 className="text-sm uppercase tracking-[0.2em] text-white/60">Synopsis</h2>
            <p className="text-white/85 leading-relaxed">{project.synopsis}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm uppercase tracking-[0.2em] text-white/60">Media</h2>
            <div className="grid gap-6">
              {project.media.map((m, idx) => (
                <div key={`${m.url}-${idx}`} className="border border-white/10 bg-black/30">
                  {m.type === 'image' ? (
                    <div className="relative aspect-[16/9] w-full">
                      <Image src={m.url} alt={m.caption ?? ''} fill className="object-cover" />
                    </div>
                  ) : (
                    <video
                      className="w-full"
                      src={m.url}
                      controls
                      playsInline
                      preload="metadata"
                    />
                  )}
                  {m.caption ? (
                    <div className="px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/60">
                      {m.caption}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm uppercase tracking-[0.2em] text-white/60">Credits</h2>
          <div className="space-y-3 border border-white/10 bg-black/30 p-5">
            {project.credits.map((c) => (
              <div key={`${c.role}-${c.name}`} className="flex items-baseline justify-between gap-6">
                <div className="text-white/60 text-sm">{c.role}</div>
                <div className="text-white text-sm text-right">{c.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
