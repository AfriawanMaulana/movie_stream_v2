import MovieList from "../components/MovieList";
import SearchInput from "../components/SearchInput";
import SearchFilter from "./SearchFilter";
import { getMovies } from "@/lib/tmdb/getMovies";
import MovieSkeleton from "../components/MovieSkeleton";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string; category?: string }>;
}) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const query = params.query ?? "";
  const category = params.category ?? "movie";

  if (!query) {
    return (
      <div className="px-5 lg:px-14 py-20">
        <title>Search - TERFLIX</title>
        <h1 className="text-2xl px-4 my-4 border-l-2 border-red-500">
          Search for Movies or TV series.
        </h1>
        <SearchInput />
        <SearchFilter />
      </div>
    );
  }

  const endpoint =
    category === "tv"
      ? `/api/tmdb/search/tv?query=${encodeURIComponent(query)}`
      : `/api/tmdb/search/movie?query=${encodeURIComponent(query)}`;

  const search = await getMovies(endpoint, page);

  return (
    <div>
      <title>Search - TERFLIX</title>
      <section className="px-5 lg:px-14 py-20 flex flex-col">
        <div>
          <h1 className="text-2xl px-4 my-4 border-l-2 border-red-500">
            Results found: <span className="font-semibold">{query}</span>
          </h1>
        </div>
        <SearchInput />
        <SearchFilter />

        <Suspense fallback={<MovieSkeleton />}>
          <MovieList data={search} category={category} header="" isPagination />
        </Suspense>
      </section>
    </div>
  );
}
