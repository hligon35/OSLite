export function Section({
  children,
  contained = true
}: {
  children: React.ReactNode;
  contained?: boolean;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-20 md:px-6 md:pb-16 md:pt-24">
      {contained ? (
        <div className="border border-white/10 bg-black/80 backdrop-blur-sm p-6 md:p-10">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}
