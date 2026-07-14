"use client";

import { useRouter, useSearchParams } from "next/navigation";
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

export default function GenreFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "movie";
  const region = searchParams.get("region") ?? "";

  /* ================= HELPERS ================= */

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set(key, value);
    params.set("page", "1"); // reset pagination

    router.push(`?${params.toString()}`);
  };

  /* ================= RENDER ================= */

  return (
    <div className="my-4 flex items-center justify-between">
      {/* CATEGORY BUTTON */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => updateParam("category", "movie")}
          className={`${
            category === "movie"
              ? "text-red-500 border border-red-500 scale-105"
              : "border border-white/20 text-white/50"
          } transition-all duration-200 ease-in-out text-sm font-semibold px-4 py-2 rounded-md`}
        >
          MOVIE
        </button>

        <button
          onClick={() => updateParam("category", "tv")}
          className={`${
            category === "tv"
              ? "text-red-500 border border-red-500 scale-105"
              : "border border-white/20 text-white/50"
          } transition-all duration-200 ease-in-out text-sm font-semibold px-4 py-2 rounded-md`}
        >
          TV
        </button>
      </div>

      {/* FILTER POPOVER */}
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
            <h4 className="leading-none font-medium">Filter by</h4>

            {/* REGION SELECT */}
            <Select
              value={region}
              onValueChange={(value) => updateParam("region", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>

              <SelectContent className="bg-primary/90 border-accent text-white">
                <SelectGroup>
                  <SelectLabel>Countries</SelectLabel>
                  <SelectItem value="id">Indonesia</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
