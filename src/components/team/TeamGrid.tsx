import Image from 'next/image';
import type { Founder } from '@/lib/types';

export function TeamGrid({ founders }: { founders: Founder[] }) {
  const isSingle = founders.length === 1;

  return (
    <div
      className={`${
        isSingle ? 'flex justify-center' : 'grid md:grid-cols-2'
      } gap-6 animate-fade-up`}
    >
      {founders.map((f) => (
        <div
          key={f.id}
          className={`${
            isSingle ? 'w-full max-w-4xl' : ''
          } flex flex-col md:flex-row border border-white/10 bg-black/30 transition hover:border-white/25`}
        >
          <div className="w-full md:w-1/4 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-white/10">
            <div className="relative h-32 md:h-48 w-32 md:w-48 overflow-hidden rounded-lg">
              <Image
                src={f.photoUrl}
                alt={f.name}
                fill
                sizes="(max-width: 768px) 128px, 192px"
                className="object-cover"
              />
            </div>
            <div className="text-lg md:text-xl font-semibold tracking-tight text-white text-center mt-4">
              {f.name}
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-white/60 text-center mt-1">
              {f.title}
            </div>
          </div>
          <div className="w-full md:w-3/4 flex items-center p-4 md:p-6">
            <div className="text-sm md:text-base text-white/80 leading-relaxed space-y-4">
              {f.bio.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
