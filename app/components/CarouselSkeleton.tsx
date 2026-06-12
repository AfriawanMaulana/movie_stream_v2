// components/CarouselSkeleton.tsx

export default function CarouselSkeleton() {
  return (
    <div className="w-full max-w-full h-auto mx-auto">
      <div className="relative w-full md:h-[95vh] h-[80vh] overflow-hidden">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-white/10 animate-pulse" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end px-5 md:px-14 py-10 space-y-4">
          {/* Badge MOVIE / TV */}
          <div className="h-7 w-24 rounded-xs bg-white/10 animate-pulse" />

          {/* Logo / Title */}
          <div className="h-[80px] md:h-[100px] w-56 md:w-80 rounded-md bg-white/10 animate-pulse" />

          {/* Rating & Date */}
          <div className="flex gap-2 items-center">
            <div className="h-4 w-12 rounded bg-white/10 animate-pulse" />
            <div className="h-4 w-28 rounded bg-white/10 animate-pulse" />
          </div>

          {/* Overview */}
          <div className="space-y-2 lg:max-w-[50%]">
            <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
            <div className="h-4 w-4/5 rounded bg-white/10 animate-pulse" />
          </div>

          {/* Watch Now button */}
          <div className="h-12 w-44 rounded-md bg-white/10 animate-pulse" />
        </div>

        {/* Pagination dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 items-center">
          <div className="h-2 w-2 rounded-full bg-white/20 animate-pulse" />
          <div className="h-2 w-5 rounded-full bg-white/30 animate-pulse" />
          <div className="h-2 w-2 rounded-full bg-white/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
