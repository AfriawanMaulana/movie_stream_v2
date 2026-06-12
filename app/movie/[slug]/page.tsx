import MovieDetail from "@/app/components/MovieDetail";
import MovieDetailSkeleton from "@/app/components/MovieDetailSkeleton";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<MovieDetailSkeleton />}>
      <MovieDetail />
    </Suspense>
  );
}
