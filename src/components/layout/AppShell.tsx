'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FullScreenMenuOverlay } from '@/components/nav/FullScreenMenuOverlay';
import { FixedVideoBackground } from '@/components/primitives/FixedVideoBackground';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');
  const [newsletterToast, setNewsletterToast] = useState<string | null>(null);
  const pathname = usePathname();
  const showGlobalBackgroundVideo = pathname !== '/';

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeMenu();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeMenu]);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [menuOpen]);

  async function onNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (!email) return;

    setNewsletterStatus('sending');
    setNewsletterToast(null);

    try {
      const res = await fetch('/api/forms/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'Failed to subscribe');
      }

      setNewsletterEmail('');
      setNewsletterStatus('success');
      setNewsletterToast('Subscribed');
    } catch {
      setNewsletterStatus('error');
      setNewsletterToast('Error');
    }
  }

  return (
    <div className="min-h-[100svh] bg-black text-white flex flex-col relative overscroll-y-none overflow-x-hidden">
      {showGlobalBackgroundVideo ? (
        <FixedVideoBackground src="/offseason_(2025)_-_official_trailer.mp4" />
      ) : null}
      <Header menuOpen={menuOpen} onToggleMenu={toggleMenu} />
      <FullScreenMenuOverlay open={menuOpen} onClose={closeMenu} />

      <main className="animate-fade-in flex-1 relative z-10">{children}</main>

      <section className="relative z-10 border-t border-white/10 bg-black">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                Subscribe
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Newsletter
              </div>
              <div className="mt-2 text-sm text-white/70">
                Get updates on new releases, screenings, and news.
              </div>
            </div>

            <form
              className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-center"
              onSubmit={onNewsletterSubmit}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email
              </label>
              <input
                id="newsletter-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Email address"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full rounded-full border border-white/15 bg-black px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
              />
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={newsletterStatus === 'sending'}
                  className={
                    'inline-flex shrink-0 items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition ' +
                    (newsletterStatus === 'sending'
                      ? 'border-white/10 text-white/40 cursor-not-allowed'
                      : 'border-white/15 bg-transparent text-white/85 hover:border-white/30 hover:text-white')
                  }
                >
                  {newsletterStatus === 'sending' ? 'Sending…' : 'Subscribe'}
                </button>
                {newsletterToast ? (
                  <span
                    className="text-xs uppercase tracking-[0.2em] text-white/70"
                    role="status"
                    aria-live="polite"
                  >
                    {newsletterToast}
                  </span>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </section>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
