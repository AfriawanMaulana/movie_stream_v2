import AdsBanner from "@/app/components/AdsBanner";
import MovieList from "../../components/MovieList";
import MovieSkeleton from "../../components/MovieSkeleton";
import { getMovies } from "@/lib/tmdb/getMovies";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; get?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const query = params?.get || "movie";

  const top_rated = await getMovies(`/api/tmdb/${query}/top_rated`, page);

  return (
    <div>
      <title>Top Rated - TERFLIX</title>
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
              className="hidden md:block"
            />
          </div>
        <Suspense fallback={<MovieSkeleton count={12} />}>
          <MovieList
            data={top_rated}
            category={query as string}
            header="Top rated"
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
            className="hidden md:block"
          />
        </div>
      </section>
    </div>
  );
}
