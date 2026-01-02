"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

/* ================= TYPES ================= */

interface MovieItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
}

interface DataType {
  results: MovieItem[];
  total_pages: number;
}

/* ================= COMPONENT ================= */

export default function MovieList({
  data,
  category,
  header,
  isPagination,
  seeAll,
}: {
  data: DataType;
  category: string;
  header?: string;
  isPagination?: boolean;
  seeAll?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = data?.total_pages ?? 1;

  /* ================= HELPERS ================= */

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const slugify = (str?: string) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  /* ================= PAGINATION ================= */

  const visiblePages = 5;
  const half = Math.floor(visiblePages / 2);

  let startPage = Math.max(1, currentPage - half);
  const endPage = Math.min(totalPages, startPage + visiblePages - 1);

  if (endPage - startPage < visiblePages - 1) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  if (!data?.results?.length) return null;

  /* ================= RENDER ================= */

  return (
    <div>
      {/* Header */}
      <div className="flex w-full justify-between items-center">
        <h1 className="text-xl px-4 my-4 border-l-2 border-red-500">
          {header?.toUpperCase()}
        </h1>
        {seeAll && (
          <Link
            href={seeAll}
            className="text-[11px] bg-red-500 hover:bg-red-600 text-white/80 rounded-[4px] py-1 px-3"
          >
            SEE ALL
          </Link>
        )}
      </div>

      {/* Movie Grid */}
      <div className="mb-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 md:gap-4 border-b border-white/20">
        {data.results.map((item) => {
          if (!item.poster_path) return null;

          const title = item.title || item.name;

          return (
            <div key={item.id} className="flex flex-col space-y-2 h-60 md:h-80">
              <Link
                href={`/${category}/${slugify(title)}?id=${item.id}`}
                className="group w-full h-full relative overflow-hidden rounded-xl"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={title || "movie"}
                  width={200}
                  height={300}
                  className="w-full h-full object-cover transition-all duration-200 group-hover:brightness-50 group-hover:scale-110"
                />

                {/* Badge */}
                <div
                  className={`absolute top-0 left-0 text-xs font-semibold px-4 py-0.5 ${
                    category === "movie" ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {category === "movie" ? "MOVIE" : "TV"}
                </div>

                {/* Logo Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Image
                    src="/logo.png"
                    alt="logo"
                    width={150}
                    height={150}
                    className="w-40 h-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </Link>

              {/* Title & Date */}
              <div>
                <Link
                  href={`/${category}/${slugify(title)}?id=${item.id}`}
                  className="text-sm hover:text-red-500"
                >
                  <h3 className="truncate">{title}</h3>
                </Link>

                <p className="text-xs text-slate-400">
                  {(item.release_date || item.first_air_date) &&
                    new Intl.DateTimeFormat("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).format(
                      new Date(item.release_date || item.first_air_date!)
                    )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {isPagination && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => updatePage(currentPage - 1)}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {pageNumbers.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => updatePage(page)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() => updatePage(currentPage + 1)}
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
