import { Suspense } from "react";
import MovieList from "@/app/components/MovieList";
import { getMovies } from "@/lib/tmdb/getMovies";
import MovieSkeleton from "@/app/components/MovieSkeleton";
import AdsBanner from "@/app/components/AdsBanner";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; get?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const query = params?.get || "movie";

  const trending = await getMovies(`/api/tmdb/trending/${query}/week`, page);

  return (
    <div>
      <title>Most Watched - TERFLIX</title>
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
            data={trending}
            category={query as string}
            header="Trending"
            isPagination
          />
        </Suspense>
         {/* Ads */}
        <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center animate-pulse">
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
