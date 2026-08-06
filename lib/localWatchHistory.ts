"use client";

const STORAGE_KEY = "watch_history_guest";
const MAX_ITEMS = 10;

export type LocalHistoryItem = {
  id: string; // `${category}-${movieId}`, dipakai sebagai unique id lokal
  movieId: string;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  category: "movie" | "tv";
  server: number;
  seasonNumber: number | null;
  episodeNumber: number | null;
  progress: number | null;
  duration: number | null;
  watchedAt: string; // ISO string
};

export function getLocalWatchHistory(): LocalHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalWatchHistory(
  payload: Omit<LocalHistoryItem, "id" | "watchedAt">
) {
  if (typeof window === "undefined") return;

  const id = `${payload.category}-${payload.movieId}`;
  const existing = getLocalWatchHistory();

  const prevItem = existing.find((item) => item.id === id);
  const filtered = existing.filter((item) => item.id !== id);

  const isSameEpisode =
    prevItem &&
    prevItem.seasonNumber === (payload.seasonNumber ?? null) &&
    prevItem.episodeNumber === (payload.episodeNumber ?? null);

  const newItem: LocalHistoryItem = {
    id,
    movieId: payload.movieId,
    title: payload.title,
    posterPath: payload.posterPath,
    backdropPath: payload.backdropPath,
    category: payload.category,
    server: payload.server,
    seasonNumber: payload.seasonNumber ?? null,
    episodeNumber: payload.episodeNumber ?? null,
    progress:
      payload.progress !== undefined && payload.progress !== null
        ? payload.progress
        : isSameEpisode
        ? prevItem?.progress ?? null
        : 0,
    duration:
      payload.duration !== undefined && payload.duration !== null && payload.duration > 0
        ? payload.duration
        : isSameEpisode
        ? prevItem?.duration ?? null
        : null,
    watchedAt: new Date().toISOString(),
  };

  const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function removeLocalWatchHistoryItem(id: string) {
  if (typeof window === "undefined") return;
  const existing = getLocalWatchHistory();
  const updated = existing.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearLocalWatchHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}