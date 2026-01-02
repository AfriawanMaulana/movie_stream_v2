import MovieList from "../components/MovieList";
import MovieSkeleton from "../components/MovieSkeleton";
import Navbar from "../components/Navbar";
import { getMovies } from "@/lib/tmdb/getMovies";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string; get?: string };
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const query = params?.get || "movie";

  const top_rated = await getMovies(`/api/tmdb/${query}/top_rated`, page);

  return (
    <div>
      <title>Top Rated - TERFLIX</title>
      <Navbar />
      <section className="px-5 lg:px-14 py-20">
        <Suspense fallback={<MovieSkeleton />}>
          <MovieList
            data={top_rated}
            category={query as string}
            header="Top rated"
            isPagination
          />
        </Suspense>
      </section>
    </div>
  );
}
