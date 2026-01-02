import { getMovies } from "@/lib/tmdb/getMovies";
import MovieList from "../components/MovieList";
import Navbar from "../components/Navbar";
import { Suspense } from "react";
import MovieSkeleton from "../components/MovieSkeleton";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const tv_series = await getMovies("/api/tmdb/tv/popular", page);
  return (
    <div className="flex flex-col">
      <title>TV Series - TERFLIX</title>
      <Navbar />
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
