"use client";
import Navbar from "@/app/components/Navbar";
import { useSearchParams } from "next/navigation";
import MovieList from "../components/MovieList";
import { useState } from "react";
import SearchInput from "../components/SearchInput";

export default function Page() {
  const searchQuery = useSearchParams().get("query");
  const [filtered, setFiltered] = useState("movie");

  return (
    <div>
      <title>Search - TERFLIX</title>
      <Navbar />
      <section className="px-5 lg:px-14 py-20 flex flex-col">
        <div>
          <h1 className="text-2xl px-4 my-4 border-l-2 border-red-500">
            Results found: <span className="font-semibold">{searchQuery}</span>
          </h1>
        </div>
        <SearchInput />
        <div className="my-4 flex gap-4">
          <button
            onClick={() => setFiltered("movie")}
            className={`${
              filtered === "movie"
                ? "text-red-500 border border-red-500 scale-105"
                : "border border-white/20 text-white/50"
            } transition-all duration-200 ease-in-out text-sm font-semibold px-4 py-2 rounded-md hover:cursor-pointer`}
          >
            MOVIE
          </button>
          <button
            onClick={() => setFiltered("tv")}
            className={`${
              filtered === "tv"
                ? "text-red-500 border border-red-500 scale-105"
                : "border border-white/20 text-white/50"
            } transition-all duration-200 ease-in-out text-sm font-semibold px-4 py-2 rounded-md hover:cursor-pointer`}
          >
            TV
          </button>
        </div>

        <MovieList
          API_URL={`/api/tmdb/search/${filtered}?query=${encodeURIComponent(
            searchQuery as string
          )}`}
          isParam
          header=""
          category={filtered}
          isPagination
        />
      </section>
    </div>
  );
}
