import { Suspense } from "react";
import MovieList from "@/app/components/MovieList";
import NotFound from "@/app/components/NotFound";
import GenreFilter from "./GenreFilter";
import { getMovies } from "@/lib/tmdb/getMovies";
import { getGenreId } from "@/lib/tmdb/getGenreId";

export const dynamic = "force-dynamic";

const language = {
  id: "id-ID",
  en: "en-US",
  th: "en-US",
  kr: "en-US",
};

const originalLanguage = {
  id: "id",
  en: "en",
  th: "th",
  kr: "ko",
};

const certificationMap = {
  id: { country: "ID", max: "13+" },
  en: { country: "US", max: "PG-13" },
  // th: { country: "US", max: "PG-13" },
  kr: { country: "KR", max: "15" },
};

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
  const langCode = language[region as keyof typeof language] ?? "en-US";
  const originalLang =
    originalLanguage[region as keyof typeof originalLanguage] ?? region;
  const cert = certificationMap[region as keyof typeof certificationMap];
  const certParams = cert
    ? `&certification_country=${cert.country}&certification.lte=${cert.max}`
    : "";

  const movies = await getMovies(
    `/api/tmdb/discover/movie?region=${region.toUpperCase()}&include_adult=false&language=${langCode}&with_origin_country=${region.toUpperCase()}&with_original_language=${originalLang}${
      genreId ? `&with_genres=${genreId}` : ""
    }${certParams}`,
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
