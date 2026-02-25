import { Logo } from '@/components/layout/Logo';
import { HamburgerButton } from '@/components/nav/HamburgerButton';

export function Header({
  menuOpen,
  onToggleMenu
}: {
  menuOpen: boolean;
  onToggleMenu: () => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 bg-black/20 backdrop-blur-sm">
        <Logo />
        <HamburgerButton open={menuOpen} onClick={onToggleMenu} />
      </div>
    </header>
  );
}
