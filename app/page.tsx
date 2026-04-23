// app/page.tsx
export const dynamic = "force-dynamic";

import MovieList from "./components/MovieList";
// import ParticlesDemo from "./components/ParticlesEffect";
// import SearchInput from "./components/SearchInput";
import { getMovies } from "@/lib/tmdb/getMovies";
import Carousel from "./components/Carousel";
export default async function Home() {
  const page = 1;
  const today = new Date().toISOString().split("T")[0];

  const nowPlaying = await getMovies("/api/tmdb/movie/now_playing", page);
  const popular = await getMovies("/api/tmdb/trending/movie/week", page);
  const indonesian = await getMovies(
    `/api/tmdb/discover/movie?region=ID&with_original_language=id`,
    page
  );
  const tvTrending = await getMovies("/api/tmdb/trending/tv/day", page);

  return (
    <div>
      {nowPlaying && <Carousel data={nowPlaying.results} category="movie" />}
      <section className="px-5 lg:px-14 pb-20 flex flex-col">
        {/* <SearchInput /> */}
        <div className="space-y-10">
          <MovieList
            data={nowPlaying}
            category="movie"
            header="now playing"
            seeAll="/movie"
            isScroll
          />
          <MovieList
            data={popular}
            category="movie"
            header="trending"
            seeAll="/trending?get=movie"
            isScroll
          />
          <MovieList
            data={indonesian}
            category="movie"
            header="Indonesia"
            seeAll="/countries/id?get=movie"
            isScroll
          />
          <MovieList
            data={tvTrending}
            category="tv"
            header="tv trending"
            seeAll="/tv"
            isScroll
          />
        </div>
      </section>
    </div>
  );
}
