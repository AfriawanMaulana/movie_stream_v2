// app/page.tsx
export const dynamic = "force-dynamic";

import MovieList from "@/app/components/MovieList";
import { getMovies } from "@/lib/tmdb/getMovies";
import Carousel from "@/app/components/Carousel";
import { Suspense } from "react";
import MovieSkeleton from "@/app/components/MovieSkeleton";
import CarouselSkeleton from "@/app/components/CarouselSkeleton";
import { getWatchHistory } from "@/app/actions/watchHistory";
import ContinueWatching from "@/app/components/ContinueWatching";
import ContinueWatchingClient from "@/app/components/ContinueWatchingClient";

export default async function Home() {
  const page = 1;

  const [nowPlaying, popular, indonesian, tvTrending] =
    await Promise.all([
      getMovies("/api/tmdb/movie/now_playing?logo=true", page),
      getMovies("/api/tmdb/trending/movie/week", page),
      getMovies(
        `/api/tmdb/discover/movie?region=ID&with_origin_country=ID&with_original_language=id&certification_country=ID&certification.lte=13+`,
        page
      ),
      getMovies("/api/tmdb/trending/tv/day", page),
    ]);

  const historyResult = await getWatchHistory(10);
  const serverHistory = historyResult.success ? historyResult.data ?? [] : [];


  return (
    <div>
      {nowPlaying && (
        <Suspense fallback={<CarouselSkeleton />}>
          <Carousel data={nowPlaying.results} category="movie" />
        </Suspense>
      )}
      <section className="px-5 lg:px-14 pb-20 flex flex-col">
        <div className="space-y-10">
          <ContinueWatchingClient serverHistory={serverHistory} />

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