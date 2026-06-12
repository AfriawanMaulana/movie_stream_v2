export default function MovieSkeleton({
  count = 6,
  isScroll = false,
}: {
  count?: number;
  isScroll?: boolean;
}) {
  return (
    <div>
      {/* Header skeleton */}
      <div className="flex w-full justify-between items-center">
        <div className="h-6 w-40 my-4 bg-white/10 rounded animate-pulse" />
        <div className="h-6 w-14 bg-white/10 rounded animate-pulse" />
      </div>

      {/* Cards skeleton */}
      <div
        className={`${
          isScroll
            ? "flex overflow-hidden space-x-4"
            : "grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 md:gap-4"
        } mb-2 pb-2 border-b border-white/20`}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col space-y-2 h-60 md:h-80 flex-shrink-0 w-32 md:w-44"
          >
            {/* Poster */}
            <div className="w-full h-full rounded-xl bg-white/10 animate-pulse" />

            {/* Title */}
            <div className="h-3.5 w-full bg-white/10 rounded animate-pulse" />

            {/* Date */}
            <div className="h-3 w-2/3 bg-white/10 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
