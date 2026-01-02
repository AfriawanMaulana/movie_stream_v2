import Navbar from "@/app/components/Navbar";
import MovieList from "@/app/components/MovieList";
import CategorySwitch from "./Category";
import { getMovies } from "@/lib/tmdb/getMovies";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { type?: "movie" | "tv"; page?: string };
}) {
  const Params = await params;
  const sp = await searchParams;
  const year = Params.id;
  const category = sp.type ?? "movie";
  const page = Number(sp.page) || 1;

  const apiUrl =
    category === "movie"
      ? `/api/tmdb/discover/movie?sort_by=release_date.desc&primary_release_year=${year}&page=${page}`
      : `/api/tmdb/discover/tv?sort_by=first_air_date.desc&first_air_date_year=${year}&page=${page}`;

  const movies = await getMovies(apiUrl, page);

  console.log(year);
  return (
    <>
      <Navbar />

      <section className="px-5 lg:px-14 py-20 flex flex-col space-y-10">
        {/* Title */}
        <div className="relative border-t-2 border-white/20 flex w-full h-0 mt-10 items-center justify-center">
          <h1 className="font-semibold text-3xl bg-background absolute px-4">
            {year}
          </h1>
        </div>

        {/* Category Toggle */}
        <CategorySwitch active={category} />

        {/* Movies */}
        <MovieList data={movies} category={category} isPagination />
      </section>
    </>
  );
}
