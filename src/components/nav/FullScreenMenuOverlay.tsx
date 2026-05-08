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
  onClose,
  returnFocusRef
}: {
  open: boolean;
  onClose: () => void;
  returnFocusRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();

    const panel = panelRef.current;
    if (!panel) return;

    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Tab') return;

      const currentPanel = panelRef.current;
      if (!currentPanel) return;

      const focusable = Array.from(currentPanel.querySelectorAll<HTMLElement>(selectors));
      if (focusable.length === 0) {
        event.preventDefault();
        currentPanel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    panel.addEventListener('keydown', onKeyDown);
    return () => panel.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) {
      returnFocusRef?.current?.focus();
    }
  }, [open, returnFocusRef]);

  if (!open) return null;

  return (
    <div
      id="site-menu"
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
