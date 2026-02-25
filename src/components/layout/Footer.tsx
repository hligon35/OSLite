import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="text-xs uppercase tracking-[0.2em] text-white/60">
          Offseason Studio — minimal, cinematic, modern.
        </div>
        <div className="flex items-center gap-5 text-xs uppercase tracking-[0.2em] text-white/70">
          <Link href="#" className="transition hover:text-white">
            Instagram
          </Link>
          <Link href="#" className="transition hover:text-white">
            Vimeo
          </Link>
          <Link href="#" className="transition hover:text-white">
            YouTube
          </Link>
        </div>
      </div>
    </footer>
  );
}
