import { getMovies } from "@/lib/tmdb/getMovies";
import MovieList from "@/app/components/MovieList";
import { Suspense } from "react";
import MovieSkeleton from "@/app/components/MovieSkeleton";
import Carousel from "@/app/components/Carousel";
import AdsBanner from "@/app/components/AdsBanner";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const tv_series = await getMovies("/api/tmdb/tv/popular?logo=true", page);
  return (
    <div className="flex flex-col">
      <title>TV Series - TERFLIX</title>
      {tv_series && <Carousel data={tv_series.results} category="tv" />}
      <section className="px-5 lg:px-14 py-20">
         {/* Ads */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center animate-pulse">
            <AdsBanner
              adKey="11dc30a983c4986cbec90d0d54c60371"
              width={728}
              height={80}
            />
            <AdsBanner
              adKey="11dc30a983c4986cbec90d0d54c60371"
              width={728}
              height={80}
            />
          </div>
        <Suspense fallback={<MovieSkeleton />}>
          <MovieList
            data={tv_series}
            category={"tv"}
            header="Popular"
            isPagination
          />
        </Suspense>
         {/* Ads */}
          <div className="pt-2 grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center animate-pulse">
            <AdsBanner
              adKey="11dc30a983c4986cbec90d0d54c60371"
              width={728}
              height={80}
            />
            <AdsBanner
              adKey="11dc30a983c4986cbec90d0d54c60371"
              width={728}
              height={80}
            />
          </div>
      </section>
    </div>
  );
}
