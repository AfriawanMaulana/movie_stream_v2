"use client";
import MovieList from "@/app/components/MovieList";
import Navbar from "@/app/components/Navbar";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function Page() {
  const params = useParams().slug?.toString();
  const [genreId, setGenreId] = useState<number | string>();
  const [category, setCategory] = useState("movie");
  const [region, setRegion] = useState("");

  useEffect(() => {
    axios
      .get(`/api/tmdb/genre/movie/list`)
      .then((res) => {
        const filterGenre = res.data.genres
          .filter(
            (item: { name: string }) => item.name.toLowerCase() === params
          )
          .map((item: { id: number }) => item.id);
        setGenreId(filterGenre as string);
      })
      .catch((err) => console.error(err));
  }, [params]);

  return (
    <div>
      <title>Genre - TERFLIX</title>
      <Navbar />
      <section className="px-5 lg:px-14 py-20 flex flex-col space-y-10">
        <div className="relative border-t-2 border-white/20 flex w-full h-0 mt-10 items-center justify-center">
          <h1 className="font-semibold text-3xl bg-background absolute px-4">
            {params && params.charAt(0).toUpperCase() + params.slice(1)}
          </h1>
        </div>
        <div className="my-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCategory("movie")}
              className={`${
                category === "movie"
                  ? "text-red-500 border border-red-500 scale-105"
                  : "border border-white/20 text-white/50"
              } transition-all duration-200 ease-in-out text-sm font-semibold px-4 py-2 rounded-md hover:cursor-pointer`}
            >
              MOVIE
            </button>
            <button
              onClick={() => setCategory("tv")}
              className={`${
                category === "tv"
                  ? "text-red-500 border border-red-500 scale-105"
                  : "border border-white/20 text-white/50"
              } transition-all duration-200 ease-in-out text-sm font-semibold px-4 py-2 rounded-md hover:cursor-pointer`}
            >
              TV
            </button>
          </div>
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
                <Select onValueChange={(e) => setRegion(e)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent className="bg-primary/90 border-accent text-white">
                    <SelectGroup className="text-white">
                      <SelectLabel>Countries</SelectLabel>
                      <SelectItem value="id">ID</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <MovieList
          API_URL={`/api/tmdb/discover/${category}?with_genres=${Number(
            genreId
          )}${
            region &&
            `&region=${region.toUpperCase()}&language=${
              region === "id" ? "id-ID" : "en-US"
            }&with_original_language=${region}&sort_by=primary_release_date.desc`
          }`}
          category={category}
          header="Recently Added"
          isParam
          isPagination
        />
      </section>
    </div>
  );
}
