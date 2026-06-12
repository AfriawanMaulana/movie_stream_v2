// components/MovieDetailSkeleton.tsx

export default function MovieDetailSkeleton() {
  return (
    <div className="py-20 flex flex-col space-y-10">
      {/* Backdrop + Info */}
      <div className="flex gap-5 pb-4">
        <div className="relative w-full md:h-[75vh] h-[80vh] overflow-hidden">
          <div className="absolute inset-0 bg-white/10 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

          <div className="absolute bottom-4 left-4 flex flex-col md:flex-row gap-5">
            {/* Poster */}
            <div className="w-20 md:w-52 h-28 md:h-72 rounded-xl bg-white/10 animate-pulse flex-shrink-0" />

            <div className="flex flex-col space-y-4">
              {/* Title */}
              <div className="h-10 w-64 md:w-96 rounded bg-white/10 animate-pulse" />

              {/* Rating row */}
              <div className="flex gap-2 items-center">
                <div className="h-4 w-12 rounded bg-white/10 animate-pulse" />
                <div className="h-4 w-14 rounded bg-white/10 animate-pulse" />
                <div className="h-4 w-10 rounded bg-white/10 animate-pulse" />
                <div className="h-4 w-20 rounded bg-white/10 animate-pulse" />
              </div>

              {/* Genre badges */}
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-7 w-16 rounded-md bg-white/10 animate-pulse"
                  />
                ))}
              </div>

              {/* Overview */}
              <div className="space-y-2 md:w-3/4">
                <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
                <div className="h-4 w-4/5 rounded bg-white/10 animate-pulse" />
              </div>

              {/* Watch button */}
              <div className="h-11 w-36 rounded-lg bg-white/10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-10">
        {/* Cast */}
        <div className="space-y-4">
          <div className="h-7 w-16 rounded bg-white/10 animate-pulse" />
          <div className="flex space-x-5 md:space-x-10 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center space-y-2 flex-shrink-0"
              >
                <div className="w-28 h-28 rounded-full bg-white/10 animate-pulse" />
                <div className="h-3.5 w-20 rounded bg-white/10 animate-pulse" />
                <div className="h-3 w-14 rounded bg-white/10 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="flex flex-col w-full mt-20 items-center space-y-6">
          <div className="h-7 w-28 rounded bg-white/10 animate-pulse" />

          {/* Input area */}
          <div className="w-full md:w-1/2 border-b-2 border-white/20 p-4 space-y-4">
            <div className="flex gap-4 items-center">
              <div className="w-28 md:w-20 h-20 rounded-full bg-white/10 animate-pulse flex-shrink-0" />
              <div className="w-full h-24 rounded-lg bg-white/10 animate-pulse" />
            </div>
            <div className="flex justify-end gap-2">
              <div className="h-10 w-full md:w-1/2 rounded-lg bg-white/10 animate-pulse" />
              <div className="h-10 w-full md:w-40 rounded-lg bg-white/10 animate-pulse" />
            </div>
          </div>

          {/* Comment items */}
          <div className="w-full md:w-1/2 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 border border-white/10 p-4 rounded-lg"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <div className="h-3.5 w-24 rounded bg-white/10 animate-pulse" />
                    <div className="h-3 w-20 rounded bg-white/10 animate-pulse" />
                  </div>
                  <div className="h-3.5 w-full rounded bg-white/10 animate-pulse" />
                  <div className="h-3.5 w-3/4 rounded bg-white/10 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
