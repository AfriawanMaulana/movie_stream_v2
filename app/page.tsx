"use client";
import MovieList from "./components/MovieList";
import Navbar from "./components/Navbar";
import SearchInput from "./components/SearchInput";

export default function Home() {
  return (
    <div>
      <Navbar />
      <section className="px-5 lg:px-14 py-20 flex flex-col">
        <SearchInput />
        <div className="space-y-10">
          <MovieList
            API_URL="/api/tmdb/movie/now_playing"
            category="movie"
            header="now playing"
            seeAll="/movie"
          />
          <MovieList
            API_URL="/api/tmdb/movie/popular"
            category="movie"
            header="trending"
            seeAll="/trending?get=movie"
          />
          <MovieList
            API_URL="/api/tmdb/trending/tv/day"
            category="tv"
            header="tv trending"
            seeAll="/tv"
          />
        </div>
      </section>
    </div>
  );
}
