export default function MovieSkeleton() {
  return (
    <section className="grid grid-cols-3 md:grid-cols-6 gap-3 px-5 py-20">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="h-72 bg-primary rounded-xl animate-pulse" />
      ))}
    </section>
  );
}

