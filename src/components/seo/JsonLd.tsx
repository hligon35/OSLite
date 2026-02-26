export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD is data, not executable JS.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
