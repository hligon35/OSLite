'use client';

import { forwardRef } from 'react';

type HamburgerButtonComponentProps = {
  open: boolean;
  onClick: () => void;
  controls?: string;
};

export const HamburgerButton = forwardRef<HTMLButtonElement, HamburgerButtonComponentProps>(function HamburgerButton({
  open,
  onClick,
  controls
}, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      aria-controls={controls}
      className="group inline-flex h-11 w-11 items-center justify-center border border-white/20 bg-black/30 transition hover:border-white/40"
    >
      <span className="sr-only">Menu</span>
      <span className="relative block h-4 w-5">
        <span
          className={
            'absolute left-0 top-0 h-[2px] w-5 bg-white transition-transform duration-200 ' +
            (open ? 'translate-y-[7px] rotate-45' : '')
          }
        />
        <span
          className={
            'absolute left-0 top-[7px] h-[2px] w-5 bg-white transition-opacity duration-200 ' +
            (open ? 'opacity-0' : 'opacity-100')
          }
        />
        <span
          className={
            'absolute left-0 top-[14px] h-[2px] w-5 bg-white transition-transform duration-200 ' +
            (open ? 'translate-y-[-7px] -rotate-45' : '')
          }
        />
      </span>
    </button>
  );
});
