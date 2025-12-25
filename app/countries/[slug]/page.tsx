"use client";
import { useParams } from "next/navigation";
import MovieList from "../../components/MovieList";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import NotFound from "@/app/components/NotFound";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Data = {
  total_results: number;
};

interface GenreType {
  genres: [
    {
      id: number;
      name: string;
    }
  ];
}

export default function Page() {
  const params = useParams().slug?.toString();
  const [data, setData] = useState<Data>();
  const [genres, setGenres] = useState<GenreType>();
  const [genreId, setGenreId] = useState<number | string>();

  useEffect(() => {
    axios
      .get("/api/tmdb/genre/movie/list")
      .then((res) => setGenres(res.data))
      .catch((err) => console.error(err));
    axios
      .get(
        `/api/tmdb/discover/movie?region=${params?.toUpperCase}&with_original_language=${params}&sort_by=primary_release_date.desc`
      )
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [params]);

  return (
    <div className="flex flex-col">
      <title>TERFLIX</title>
      <Navbar />

      <section className="px-5 lg:px-14 py-20">
        <div className="flex w-full justify-end">
          <Popover>
            <PopoverTrigger>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                />
              </svg>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-primary/90 border-0 text-white">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="leading-none font-medium">Filter by</h4>
                </div>
                <Select onValueChange={(e) => setGenreId(e)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>
                  <SelectContent className="bg-primary/90 border-accent text-white">
                    <SelectGroup className="text-white">
                      <SelectLabel>Genres</SelectLabel>
                      {genres?.genres.map((genre) => (
                        <SelectItem key={genre.id} value={`${genre.id}`}>
                          {genre.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {data?.total_results == 0 ? (
          <NotFound />
        ) : (
          <MovieList
            API_URL={`/api/tmdb/discover/movie?region=${params?.toUpperCase()}&language=${
              params === "id" ? "id-ID" : "en-US"
            }&with_original_language=${params}${
              genreId ? `&with_genres=${Number(genreId)}` : ""
            }&sort_by=primary_realese_date.desc`}
            category="movie"
            header="popular"
            isPagination
            isParam
          />
        )}
      </section>
    </div>
  );
}
