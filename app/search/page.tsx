import Navbar from "@/app/components/Navbar";
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
  searchParams: { page?: string; query?: string; category?: string };
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = await getMovies(
    `/api/tmdb/search/${params.category || "movie"}?query=${encodeURIComponent(
      params.query as string
    )}&page=${page}`
  );

  return (
    <div>
      <title>Search - TERFLIX</title>
      <Navbar />
      <section className="px-5 lg:px-14 py-20 flex flex-col">
        <div>
          <h1 className="text-2xl px-4 my-4 border-l-2 border-red-500">
            Results found: <span className="font-semibold">{params.query}</span>
          </h1>
        </div>
        <SearchInput />
        <SearchFilter />

        <Suspense fallback={<MovieSkeleton />}>
          <MovieList
            data={search}
            category={(params.category as string) || "movie"}
            header=""
            isPagination
          />
        </Suspense>
      </section>
    </div>
  );
}
