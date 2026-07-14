"use client";
import { getWatchlist } from "@/app/actions/getWatchlist";
import { Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface WatchlistProps {
  movie_id: string;
  poster_path?: string | null;
  title: string;
  category: string;
  saved_at: Date;
}

function WatchlistSkeleton() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 md:gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col space-y-2 h-60 md:h-72 flex-shrink-0 w-32 md:w-44"
        >
          <div className="w-full h-full rounded-xl bg-white/10 animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  const [watchlist, setWatchlist] = useState<WatchlistProps[]>([]);
  const [loading, setLoading] = useState(true);

  const slugify = (str?: string) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  useEffect(() => {
    async function fetchWatchlist() {
      try {
        const res = await getWatchlist();
        if (res.success) {
          setWatchlist(res.data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchWatchlist();
  }, []);

  return (
    <section className="px-5 lg:px-14 py-20">
      <h1 className="inline-flex items-center gap-4 text-2xl border-b border-white/20 w-full pb-4 my-8">
        <Bookmark color="yellow" size={24} /> My List
      </h1>

      {loading ? (
        <WatchlistSkeleton />
      ) : watchlist.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 md:gap-4">
          {watchlist.map((item) => (
            <div
              key={item.movie_id}
              className="flex flex-col space-y-2 h-60 md:h-72 flex-shrink-0 w-32 md:w-44"
            >
              <Link
                href={`/${item.category}/${slugify(item.title)}?id=${
                  item.movie_id
                }`}
                className="group w-full h-full relative overflow-hidden rounded-xl"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title}
                  width={200}
                  height={300}
                  unoptimized
                  className="w-full h-full object-cover transition-all duration-200 group-hover:brightness-50 group-hover:scale-110"
                />

                {/* Badge */}
                <div
                  className={`absolute top-0 left-0 text-xs font-semibold px-4 py-0.5 ${
                    item.category === "movie" ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {item.category === "movie" ? "MOVIE" : "TV"}
                </div>

                {/* Logo Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Image
                    src="/logo-2.png"
                    alt="logo"
                    width={150}
                    height={150}
                    className="w-40 h-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </Link>
              {/* Title  */}
              <div>
                <Link
                  href={`/${item.category}/${slugify(item.title)}?id=${
                    item.movie_id
                  }`}
                  className="text-sm hover:text-red-500"
                >
                  <h3 className="truncate font-medium">{item.title}</h3>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center w-full ">
          <h1 className="opacity-80">No watchlist items</h1>
        </div>
      )}
    </section>
  );
}
