export function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-20 md:px-6 md:pb-16 md:pt-24">
      {children}
    </section>
  );
}
