'use client';

import { useEffect, useRef } from 'react';
import { NavLink } from '@/components/nav/NavLink';

const links = [
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
      className="fixed inset-0 z-[60] animate-menu-in"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      onClick={onClose}
      style={{
        backgroundImage: `url(/rubberLogo.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative grid h-full w-full grid-cols-1 grid-rows-3 outline-none"
      >
        {links.map((l) => (
          <div
            key={l.href}
            className="flex items-center justify-center border-y border-white/10 first:border-t-0 last:border-b-0"
          >
            <NavLink href={l.href} onClick={onClose}>
              {l.label}
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}
