import { Suspense } from "react";
import MovieList from "../components/MovieList";
import Navbar from "../components/Navbar";
import { getMovies } from "@/lib/tmdb/getMovies";
import MovieSkeleton from "../components/MovieSkeleton";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string; get?: string };
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const query = params?.get || "movie";

  const trending = await getMovies(
    `/api/tmdb/trending/${query}/week?language=en-US&page=${page}`
  );

  return (
    <div>
      <title>Most Watched - TERFLIX</title>
      <Navbar />
      <section className="px-5 lg:px-14 py-20">
        <Suspense fallback={<MovieSkeleton />}>
          <MovieList
            data={trending}
            category={query as string}
            header="Trending"
            isPagination
          />
        </Suspense>
      </section>
    </div>
  );
}
