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
            isSingle ? 'w-full max-w-xl' : ''
          } border border-white/10 bg-black/30 p-6 transition hover:border-white/25`}
        >
          <div className="flex items-start gap-5">
            <div className="relative h-16 w-16 overflow-hidden border border-white/10 bg-black/30">
              <Image
                src={f.photoUrl}
                alt={f.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="text-xl font-semibold tracking-tight text-white">{f.name}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/60">
                {f.title}
              </div>
            </div>
          </div>
          <p className="mt-5 text-white/80 leading-relaxed">{f.bio}</p>
        </div>
      ))}
    </div>
  );
}
