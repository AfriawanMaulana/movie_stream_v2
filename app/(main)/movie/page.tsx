export const dynamic = "force-dynamic";
import { Suspense } from "react";
import MovieList from "@/app/components/MovieList";
import { getMovies } from "@/lib/tmdb/getMovies";
import MovieSkeleton from "@/app/components/MovieSkeleton";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; get?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const query = params?.get || "movie";

  const data = await getMovies(`/api/tmdb/movie/now_playing`, page);

  return (
    <div>
      <title>Movies - TERFLIX</title>
      <section className="px-5 lg:px-14 py-20">
        <Suspense fallback={<MovieSkeleton />}>
          <MovieList
            data={data}
            category={query as string}
            header="now playing"
            isPagination
          />
        </Suspense>
      </section>
    </div>
  );
}
