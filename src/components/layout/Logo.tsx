import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" aria-label="Go to landing page" className="inline-flex items-center">
      <Image
        src="/offseasonlogo.png"
        alt="Offseason Studio"
        width={160}
        height={48}
        priority
        className="h-8 w-auto opacity-95 transition hover:opacity-100"
      />
    </Link>
  );
}
