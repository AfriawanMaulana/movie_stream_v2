"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Play, AlertTriangle, Loader2 } from "lucide-react";
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleDelete = async (id: string) => {
    const res = await deleteWatchHistoryItem(id);
    if (res.success) {
      setHistory((prev) => prev.filter((item) => item.id !== id));
      toast.success("Riwayat dihapus");
    } else {
      toast.error(res.error);
    }
  };

  const confirmClearAll = async () => {
    setIsClearing(true);
    try {
      const res = await clearWatchHistory();
      if (res.success) {
        setHistory([]);
        toast.success("Semua riwayat dihapus");
        setShowConfirmModal(false);
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Gagal menghapus riwayat");
    } finally {
      setIsClearing(false);
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
          onClick={() => setShowConfirmModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-sm font-semibold text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
        >
          <Trash2 size={15} />
          <span>Hapus semua</span>
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

      {/* Delete Confirmation Popup Modal */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isClearing) {
              setShowConfirmModal(false);
            }
          }}
        >
          <div className="w-full max-w-md bg-[#181818] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Hapus Semua Riwayat?
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <p className="text-sm text-white/70">
              Apakah kamu yakin ingin menghapus seluruh riwayat tontonanmu dari akun ini?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isClearing}
                className="px-4 py-2 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={confirmClearAll}
                disabled={isClearing}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-600/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isClearing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Ya, Hapus Semua</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
