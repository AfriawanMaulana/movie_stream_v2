export const dynamic = "force-dynamic";
import { Suspense } from "react";
import MovieList from "../components/MovieList";
import Navbar from "../components/Navbar";
import { getMovies } from "@/lib/tmdb/getMovies";
import MovieSkeleton from "../components/MovieSkeleton";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string; get?: string };
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const query = params?.get || "movie";

  const popular = await getMovies(`/api/tmdb/discover/movie`, page);

  return (
    <div>
      <title>Movies - TERFLIX</title>
      <Navbar />
      <section className="px-5 lg:px-14 py-20">
        <Suspense fallback={<MovieSkeleton />}>
          <MovieList
            data={popular}
            category={query as string}
            header="Popular"
            isPagination
          />
        </Suspense>
      </section>
    </div>
  );
}
