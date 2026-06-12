// app/page.tsx
export const dynamic = "force-dynamic";

import MovieList from "../components/MovieList";
// import ParticlesDemo from "./components/ParticlesEffect";
// import SearchInput from "./components/SearchInput";
import { getMovies } from "@/lib/tmdb/getMovies";
import Carousel from "../components/Carousel";
import { Suspense } from "react";
import MovieSkeleton from "../components/MovieSkeleton";
import CarouselSkeleton from "../components/CarouselSkeleton";
export default async function Home() {
  const page = 1;
  // const today = new Date().toISOString().split("T")[0];

  const nowPlaying = await getMovies("/api/tmdb/movie/now_playing", page);
  const popular = await getMovies("/api/tmdb/trending/movie/week", page);
  const indonesian = await getMovies(
    `/api/tmdb/discover/movie?region=ID&with_origin_country=ID&with_original_language=id&certification_country=ID&certification.lte=13+`,
    page
  );
  const tvTrending = await getMovies("/api/tmdb/trending/tv/day", page);

  return (
    <div>
      {nowPlaying && (
        <Suspense fallback={<CarouselSkeleton />}>
          <Carousel data={nowPlaying.results} category="movie" />
        </Suspense>
      )}
      <section className="px-5 lg:px-14 pb-20 flex flex-col">
        {/* <SearchInput /> */}
        <div className="space-y-10">
          <Suspense fallback={<MovieSkeleton count={6} isScroll />}>
            <MovieList
              data={nowPlaying}
              category="movie"
              header="now playing"
              seeAll="/movie"
              isScroll
            />
          </Suspense>
          <Suspense fallback={<MovieSkeleton count={6} isScroll />}>
            <MovieList
              data={popular}
              category="movie"
              header="trending"
              seeAll="/trending?get=movie"
              isScroll
            />
          </Suspense>
          <Suspense fallback={<MovieSkeleton count={6} isScroll />}>
            <MovieList
              data={indonesian}
              category="movie"
              header="Indonesia"
              seeAll="/countries/id?get=movie"
              isScroll
            />
          </Suspense>
          <Suspense fallback={<MovieSkeleton count={6} isScroll />}>
            <MovieList
              data={tvTrending}
              category="tv"
              header="tv trending"
              seeAll="/tv"
              isScroll
            />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
