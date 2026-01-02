import { Suspense } from "react";
import { getMovies } from "@/lib/tmdb/getMovies";
import MovieSkeleton from "@/app/components/MovieSkeleton";
import Navbar from "@/app/components/Navbar";
import MovieList from "@/app/components/MovieList";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; get?: string }>;
}) {
  const today = new Date().toISOString().split("T")[0];
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const query = params?.get || "movie";

  const up_coming = await getMovies(
    `/api/tmdb/discover/movie?sort_by=release_date&primary_release_date.gte=${today}&page=${page}`
  );

  return (
    <div>
      <title>Up Coming - TERFLIX</title>
      <Navbar />
      <section className="px-5 lg:px-14 py-20">
        <Suspense fallback={<MovieSkeleton />}>
          <MovieList
            data={up_coming}
            category={query as string}
            header="Up Coming"
            isPagination
          />
        </Suspense>
      </section>
    </div>
  );
}
