"use client";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

//* TMDB DATA TYPE
interface DataType {
  results: [
    {
      id: number;
      title: string;
      adult: boolean;
      poster_path: string;
      release_date: string;

      name: string; //? TV series
      first_air_date: string; //? TV series
    }
  ];
  total_pages: number;
}

export default function MovieList({
  API_URL,
  isPagination,
  category,
  header,
  isParam,
  seeAll,
  filterCountry,
}: {
  API_URL: string;
  isPagination?: boolean;
  category: string;
  header?: string;
  isParam?: boolean;
  seeAll?: string;
  filterCountry?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<DataType>();

  const currentPage = Number(searchParams.get("page")) || 1;

  //* FETCHING FROM TMDB API
  useEffect(() => {
    axios
      .get(`${API_URL}${isParam ? "&" : "?"}page=${currentPage}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [API_URL, currentPage, isParam, filterCountry]);

  //* UPDATE URL WITH NEW PAGE
  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  //* HANDLE NEXT PAGE BUTTON
  const handleNext = () => {
    if (data && currentPage >= 1 && currentPage < data.total_pages) {
      updatePage(currentPage + 1);
    }
  };

  //* HANDLE PREVIOUS PAGE BUTTON
  const handlePrev = () => {
    if (currentPage > 1) {
      updatePage(currentPage - 1);
    }
  };

  //* PAGINATION
  const visiblePages = 5;
  const half = Math.floor(visiblePages / 2);
  const totalPages = data?.total_pages ?? 1;

  let startPage = Math.max(1, currentPage - half);
  const endPage = Math.min(totalPages, startPage + visiblePages - 1);

  if (endPage - startPage < visiblePages - 1) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  //* URL FRIENDLY
  const slugify = (str: string) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  if (!data?.results) return;
  return (
    <div>
      <div className="flex w-full justify-between items-center">
        <h1 className="text-xl px-4 my-4 border-l-2 border-red-500">
          {data?.results[0] && header?.toUpperCase()}
        </h1>
        {seeAll && (
          <Link
            href={`${seeAll}`}
            className="text-[11px] bg-red-500 hover:bg-red-600 text-white/80 rounded-[4px] py-1 px-3"
          >
            SEE ALL
          </Link>
        )}
      </div>
      <div
        id="movie-container"
        className="movie-container mb-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 md:gap-4 space-y-3 border-b border-white/20"
      >
        {data?.results.map((item) => {
          if (!item.poster_path) return;
          return (
            <div key={item.id} className="flex flex-col space-y-2 h-60 md:h-80">
              <Link
                href={`/${category}/${slugify(item.title || item.name)}?id=${
                  item.id
                }`}
                className="group w-full h-full relative overflow-hidden rounded-xl"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  width={130}
                  height={130}
                  alt={item.title || item.name}
                  priority
                  className="w-full h-full object-cover hover:brightness-20 hover:scale-110 transition-all duration-200 ease-in-out"
                />
                <div
                  className={`${
                    category.toLowerCase() === "movie"
                      ? "bg-red-500"
                      : "bg-green-500"
                  } absolute top-0 left-0 text-xs font-semibold px-4 py-0.5`}
                >
                  {category.toLowerCase() === "movie" ? "MOVIE" : "TV"}
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none w-full h-full">
                  <Image
                    src={"/logo.png"}
                    alt="logo.png"
                    width={150}
                    height={150}
                    className="w-36 h-auto opacity-0 group-hover:opacity-100 scale-120 group-hover:scale-100 transition-all duration-500 ease-in-out"
                  />
                </div>
              </Link>
              <div>
                <Link
                  href={`/${category}/${slugify(item.title || item.name)}?id=${
                    item.id
                  }`}
                  className="text-sm hover:text-red-500"
                >
                  <h3 className="truncate">{item.title || item.name}</h3>
                </Link>
                <p className="text-xs text-slate-400">
                  {(item.release_date &&
                    new Intl.DateTimeFormat("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                      .format(new Date(item.release_date))
                      .split(" ")
                      .join(", ")) ||
                    (item.first_air_date &&
                      new Intl.DateTimeFormat("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                        .format(new Date(item.first_air_date))
                        .split(" ")
                        .join(", "))}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Button */}
      {data.results[0] && isPagination && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePrev}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {pageNumbers.map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  isActive={currentPage === pageNum}
                  onClick={() => updatePage(pageNum)}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={handleNext}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
