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

const GENRES = [
  { id: "action", name: "Action" },
  { id: "comedy", name: "Comedy" },
  { id: "family", name: "Family" },
  { id: "drama", name: "Drama" },
  { id: "horror", name: "Horror" },
];

export default function GenreFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("genre", value);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex justify-end">
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
            <Select
              onValueChange={onChange}
              value={searchParams.get("genre") ?? ""}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>

              <SelectContent className="bg-primary/90 border-accent text-white">
                <SelectGroup>
                  <SelectLabel>Genres</SelectLabel>
                  {GENRES.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
