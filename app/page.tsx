// app/page.tsx
import MovieList from "./components/MovieList";
import Navbar from "./components/Navbar";
import ParticlesDemo from "./components/ParticlesEffect";
import SearchInput from "./components/SearchInput";
import { getMovies } from "@/lib/tmdb/getMovies";

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const nowPlaying = await getMovies("/api/tmdb/movie/now_playing", page);

  const popular = await getMovies("/api/tmdb/movie/popular", page);

  const tvTrending = await getMovies("/api/tmdb/trending/tv/day", page);

  return (
    <div>
      <Navbar />
      <ParticlesDemo />
      <section className="px-5 lg:px-14 py-20 flex flex-col">
        <SearchInput />
        <div className="space-y-10">
          <MovieList
            data={nowPlaying}
            category="movie"
            header="now playing"
            seeAll="/movie"
          />
          <MovieList
            data={popular}
            category="movie"
            header="trending"
            seeAll="/trending?get=movie"
          />
          <MovieList
            data={tvTrending}
            category="tv"
            header="tv trending"
            seeAll="/tv"
          />
        </div>
      </section>
    </div>
  );
}
