import Link from 'next/link';

export function NavLink({
  href,
  children,
  onClick
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="inline-flex items-center justify-center text-3xl md:text-5xl font-bold tracking-tight text-white/90 transition duration-200 hover:scale-[1.03] hover:text-white"
    >
      {children}
    </Link>
  );
}
