export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-5 rounded-xl border border-white/10 bg-[#1a1a1a] animate-pulse flex items-center justify-between"
        >
          <div className="space-y-2">
            <div className="h-4 w-24 bg-white/10 rounded" />
            <div className="h-8 w-16 bg-white/20 rounded" />
          </div>
          <div className="h-10 w-10 bg-white/10 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function TrafficChartSkeleton() {
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-white/20 rounded" />
          <div className="h-4 w-64 bg-white/10 rounded" />
        </div>
        <div className="h-8 w-60 bg-white/10 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[#121212] border border-white/10 rounded-xl p-4 h-20"
          />
        ))}
      </div>
      <div className="h-72 w-full bg-[#121212] rounded-xl border border-white/5" />
    </div>
  );
}
