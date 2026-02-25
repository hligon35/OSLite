export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="mb-10 text-4xl md:text-6xl font-bold tracking-tight text-white animate-fade-up">
      {children}
    </h1>
  );
}
