"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Play } from "lucide-react";
import { toast } from "react-toastify";
import {
  deleteWatchHistoryItem,
  clearWatchHistory,
} from "@/app/actions/watchHistory";

type HistoryItem = {
  id: string;
  movieId: string;
  title: string;
  posterPath: string | null;
  category: string;
  server: number;
  seasonNumber: number | null;
  episodeNumber: number | null;
  progress: number | null;
  duration: number | null;
  watchedAt: Date;
};

export default function HistoryList({
  initialHistory,
}: {
  initialHistory: HistoryItem[];
}) {
  const [history, setHistory] = useState(initialHistory);

  const handleDelete = async (id: string) => {
    const res = await deleteWatchHistoryItem(id);
    if (res.success) {
      setHistory((prev) => prev.filter((item) => item.id !== id));
      toast.success("Riwayat dihapus");
    } else {
      toast.error(res.error);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Hapus semua riwayat tontonan?")) return;
    const res = await clearWatchHistory();
    if (res.success) {
      setHistory([]);
      toast.success("Semua riwayat dihapus");
    } else {
      toast.error(res.error);
    }
  };

  if (history.length === 0) {
    return (
      <div className="flex justify-center items-center w-full py-20">
        <p className="opacity-70">Belum ada riwayat tontonan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={handleClearAll}
          className="text-sm text-red-500 hover:text-red-400"
        >
          Hapus semua
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {history.map((item) => {
          const progressPercent =
            item.duration && item.duration > 0 && item.progress && item.progress > 0
              ? Math.min(100, Math.max(0, (item.progress / item.duration) * 100))
              : 0;

          // Query string: id movie, server terakhir dipakai, dan flag autoplay
          const query = new URLSearchParams({
            id: item.movieId,
            server: String(item.server),
            autoplay: "true",
          });

          return (
            <div key={item.id} className="group relative">
              <Link
                href={`/${item.category}/${item.movieId}?${query.toString()}`}
                className="block"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                  {item.posterPath ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w342${item.posterPath}`}
                      fill
                      alt={item.title}
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <Play className="opacity-30" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Play
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="white"
                    />
                  </div>

                  {/* Progress bar overlay */}
                  {progressPercent > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                      <div
                        className="h-full bg-red-500 transition-all duration-300"
                        style={{ width: `${Math.max(2, progressPercent)}%` }}
                      />
                    </div>
                  )}
                </div>

                <p className="text-sm font-medium mt-2 line-clamp-1">
                  {item.title}
                </p>
                {item.category === "tv" && item.seasonNumber && (
                  <p className="text-xs opacity-50">
                    S{item.seasonNumber} E{item.episodeNumber}
                  </p>
                )}
                <p className="text-xs opacity-40">
                  {new Intl.DateTimeFormat("en-US", {
                    day: "2-digit",
                    month: "short",
                  }).format(new Date(item.watchedAt))}
                </p>
              </Link>

              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
