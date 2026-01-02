import Navbar from "@/app/components/Navbar";
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
  params: { slug: string };
  searchParams: { page?: string; genre?: string };
}) {
  const Params = await params;
  const sp = await searchParams;
  const region = Params.slug;
  const page = Number(sp.page) || 1;
  const genreSlug = sp.genre;

  let genreId: number | undefined;

  if (genreSlug) {
    genreId = await getGenreId(genreSlug);
  }

  const today = new Date().toISOString().split("T")[0];
  const movies = await getMovies(
    genreId
      ? `/api/tmdb/discover/movie?region=${region.toUpperCase()}&language=${
          region === "id" ? "id-ID" : "en-US"
        }&with_original_language=${region}${
          genreId ? `&with_genres=${genreId}` : ""
        }&sort_by=primary_release_date.desc&relase_date.lte=${today}&page=${page}`
      : `/api/tmdb/discover/movie?region=${region?.toUpperCase()}&page=${page}&with_original_language=${region}&sort_by=primary_release_date.desc`
  );

  if (movies.total_results === 0) {
    return (
      <>
        <Navbar />
        <NotFound />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="px-5 lg:px-14 py-20 space-y-6">
        {/* FILTER */}
        <GenreFilter />

        {/* MOVIES */}
        <MovieList
          data={movies}
          category="movie"
          header="Popular"
          isPagination
        />
      </section>
    </>
  );
}
