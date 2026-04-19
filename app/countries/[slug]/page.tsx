import { Suspense } from "react";
import MovieList from "@/app/components/MovieList";
import NotFound from "@/app/components/NotFound";
import GenreFilter from "./GenreFilter";
import { getMovies } from "@/lib/tmdb/getMovies";
import { getGenreId } from "@/lib/tmdb/getGenreId";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; genre?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const region = slug;
  const page = Number(sp.page) || 1;
  const genreSlug = sp.genre;

  let genreId: number | undefined;

  if (genreSlug) {
    genreId = await getGenreId(genreSlug);
  }

  // const today = new Date().toISOString().split("T")[0]; &sort_by=primary_release_date.desc&release_date.lte=${today}

  const movies = await getMovies(
    genreId
      ? `/api/tmdb/discover/movie?region=${region.toUpperCase()}&include_adult=false&language=${
          region === "id" ? "id-ID" : "en-US"
        }&with_original_language=${region}${
          genreId && `&with_genres=${genreId}`
        }`
      : `/api/tmdb/discover/movie?region=${region.toUpperCase()}&language=${
          region === "id" ? "id-ID" : "en-US"
        }&with_original_language=${region}&include_adult=false`,
    page
  );

  if (movies.total_results === 0) {
    return <NotFound />;
  }

  return (
    <section className="px-5 lg:px-14 py-20 space-y-6">
      <Suspense fallback={null}>
        <GenreFilter />
      </Suspense>

      <MovieList data={movies} category="movie" header="Popular" isPagination />
    </section>
  );
}
