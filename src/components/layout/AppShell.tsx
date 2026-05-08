import { HeaderMenuShell } from '@/components/layout/HeaderMenuShell';
import { NewsletterSignupSection } from '@/components/layout/NewsletterSignupSection';
import { Footer } from '@/components/layout/Footer';
import { RouteBackground } from '@/components/primitives/RouteBackground';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100svh] bg-black text-white flex flex-col relative overscroll-y-none overflow-x-hidden">
      <RouteBackground />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] border border-white/30 bg-black px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
      >
        Skip to content
      </a>

      <HeaderMenuShell />

      <main
        id="main-content"
        role="main"
        className="animate-fade-in flex-1 relative z-10"
      >
        {children}
      </main>

      <NewsletterSignupSection />

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
