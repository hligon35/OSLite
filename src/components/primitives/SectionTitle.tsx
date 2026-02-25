export function SectionTitle({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={`mb-10 text-4xl md:text-6xl font-bold tracking-tight text-white animate-fade-up ${
        className ?? ''
      }`}
    >
      {children}
    </h1>
  );
}
