import { getMovies } from "@/lib/tmdb/getMovies";
import MovieList from "../components/MovieList";
import { Suspense } from "react";
import MovieSkeleton from "../components/MovieSkeleton";
import Carousel from "../components/Carousel";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const tv_series = await getMovies("/api/tmdb/tv/popular", page);
  return (
    <div className="flex flex-col">
      <title>TV Series - TERFLIX</title>
      {tv_series && <Carousel data={tv_series.results} category="tv" />}
      <section className="px-5 lg:px-14 py-20">
        <Suspense fallback={<MovieSkeleton />}>
          <MovieList
            data={tv_series}
            category={"tv"}
            header="Popular"
            isPagination
          />
        </Suspense>
      </section>
    </div>
  );
}
