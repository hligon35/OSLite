'use client';

import { useEffect, useRef } from 'react';
import { Logo } from '@/components/layout/Logo';
import { NavLink } from '@/components/nav/NavLink';

const links = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];

export function FullScreenMenuOverlay({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] animate-menu-in bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative flex h-full w-full flex-col outline-none"
      >
        <div className="flex items-start justify-between px-4 pt-4 md:px-6 md:pt-6">
          <div className="origin-left scale-[0.8] md:scale-100">
            <Logo />
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="relative inline-flex h-11 w-11 items-center justify-center text-white/90 transition hover:text-white"
          >
            <span className="sr-only">Close menu</span>
            <span className="absolute h-px w-10 rotate-45 bg-current" />
            <span className="absolute h-px w-10 -rotate-45 bg-current" />
          </button>
        </div>

        <nav className="flex flex-1 items-center px-5 pb-10 pt-12 md:px-8 md:pt-16 lg:px-10">
          <ul className="flex w-full flex-col items-start gap-4 md:gap-6">
            {links.map((l) => (
              <li key={l.href} className="w-full">
                <NavLink
                  href={l.href}
                  onClick={onClose}
                  className="justify-start text-left text-[3.75rem] font-semibold leading-[0.9] tracking-[-0.05em] text-white sm:text-[4.75rem] md:text-[6rem] lg:text-[7.25rem]"
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
