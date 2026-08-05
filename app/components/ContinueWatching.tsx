import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { useUserStore } from "@/zustand/userStore";

type HistoryItem = {
  id: string;
  movieId: string;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  category: string;
  server: number;
  seasonNumber: number | null;
  episodeNumber: number | null;
  progress: number | null;
  duration: number | null;
  watchedAt: Date | string;
};

export default function ContinueWatching({
  data,
  username,
}: {
  data: HistoryItem[];
  username?: string;
}) {
  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl font-bold px-1">
        Continue Watching{username ? ` for ${username}` : ""}
      </h2>

      <div className="flex overflow-x-auto gap-4 no-scrollbar pb-2">
        {data.map((item) => {
          const progressPercent =
            item.duration && item.progress
              ? Math.min(100, (item.progress / item.duration) * 100)
              : 0;

          const query = new URLSearchParams({
            id: item.movieId,
            server: String(item.server),
            autoplay: "true",
          });

          const imagePath = item.backdropPath || item.posterPath;

          return (
            <Link
              key={item.id}
              href={`/${item.category}/${item.movieId}?${query.toString()}`}
              className="group flex-shrink-0 w-64 md:w-80"
            >
              <div className="relative aspect-video rounded-md overflow-hidden">
                {imagePath ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w780${imagePath}`}
                    fill
                    alt={item.title}
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <Play className="opacity-30" />
                  </div>
                )}

                {/* Gradient overlay bawah supaya teks judul kebaca */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Play icon di hover, tengah */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
                    <Play size={20} fill="white" className="ml-0.5" />
                  </div>
                </div>

                {/* Badge kategori/status, top-left */}
                <div className="absolute top-2 left-2">
                  {item.category === "tv" && (
                    <span className="text-[10px] font-semibold bg-red-600 text-white px-2 py-0.5 rounded">
                      {item.seasonNumber && item.episodeNumber
                        ? `S${item.seasonNumber} E${item.episodeNumber}`
                        : "Series"}
                    </span>
                  )}
                </div>

                {/* Judul, bottom-left */}
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-bold text-base md:text-lg line-clamp-1 drop-shadow-lg">
                    {item.title}
                  </p>
                </div>

                {/* Progress bar, paling bawah */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div
                    className="h-full bg-red-600"
                    style={{ width: `${progressPercent || 4}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}