export const dynamic = "force-dynamic";

import MovieList from "@/app/components/MovieList";
import GenreFilter from "./GenreFilter";
import { getMovies } from "@/lib/tmdb/getMovies";
import { getGenreId } from "@/lib/tmdb/getGenreId";
import AdsBanner from "@/app/components/AdsBanner";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    category?: string;
    region?: string;
  }>;
}) {
  const today = new Date().toISOString().split("T")[0];

  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const category = sp.category ?? "movie";
  const region = sp.region ?? "";

  const { slug } = await params;
  const genreId = await getGenreId(slug);

  const movies = await getMovies(
    `/api/tmdb/discover/${category}?with_genres=${Number(genreId)}${
      region &&
      `&region=${region.toUpperCase()}&language=${
        region === "id" ? "id-ID" : "en-US"
      }`
    }&with_original_language=${region}&release_date.lte=${today}`,
    page
  );

  return (
    <>
      <section className="px-5 lg:px-14 py-20">
        <div className="relative border-t-2 border-white/20 flex w-full h-0 mt-10 items-center justify-center">
          <h1 className="font-semibold text-3xl bg-background absolute px-4">
            {slug.charAt(0).toUpperCase() + slug.slice(1)}
          </h1>
        </div>
        <GenreFilter />
         {/* Ads */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center animate-pulse">
          <AdsBanner
            adKey="11dc30a983c4986cbec90d0d54c60371"
            width={728}
            height={80}
          />
          <AdsBanner
            adKey="11dc30a983c4986cbec90d0d54c60371"
            width={728}
            height={80}
            className="hidden md:block"
          />
        </div>
        <MovieList
          data={movies}
          category={category}
          header="Recently Added"
          isPagination
        />
         {/* Ads */}
        <div className="pt-2 grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center animate-pulse">
          <AdsBanner
            adKey="11dc30a983c4986cbec90d0d54c60371"
            width={728}
            height={80}
          />
          <AdsBanner
            adKey="11dc30a983c4986cbec90d0d54c60371"
            width={728}
            height={80}
            className="hidden md:block"
          />
        </div>
      </section>
    </>
  );
}
