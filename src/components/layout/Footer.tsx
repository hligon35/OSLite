export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="text-xs uppercase tracking-[0.2em] text-white/60">
          Offseason — Body. Mind. Ownership.
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs uppercase tracking-[0.2em] text-white/70">
          <a
            href="https://www.instagram.com/offseasonofc/?next=%2F"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white"
          >
            Instagram
          </a>
          <a
            href="https://www.tiktok.com/@offseasonlive"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white"
          >
            TikTok
          </a>
          <a
            href="https://x.com/offseasonofc"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white"
          >
            X
          </a>
          <a
            href="https://www.youtube.com/@OffSeasonLive"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white"
          >
            YouTube
          </a>
          <a
            href="https://www.linkedin.com/company/off-season-tv/?viewAsMember=true"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
