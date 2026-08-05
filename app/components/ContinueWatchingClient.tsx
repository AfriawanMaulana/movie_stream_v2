"use client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/zustand/userStore";
import { getLocalWatchHistory, LocalHistoryItem } from "@/lib/localWatchHistory";
import ContinueWatching from "./ContinueWatching";

type ServerHistoryItem = {
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

export default function ContinueWatchingClient({
  serverHistory,
}: {
  serverHistory: ServerHistoryItem[];
}) {
  const { user, fetchUser } = useUserStore();
  const [history, setHistory] = useState<ServerHistoryItem[] | LocalHistoryItem[]>(
    serverHistory
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetchUser().finally(() => setReady(true));
  }, [fetchUser]);

  useEffect(() => {
    if (!ready) return;

    if (user) {
      setHistory(serverHistory);
    } else {
      setHistory(getLocalWatchHistory());
    }
  }, [user, ready, serverHistory]);

  if (!ready || history.length === 0) return null;

  return <ContinueWatching data={history} username={user?.username} />;
}