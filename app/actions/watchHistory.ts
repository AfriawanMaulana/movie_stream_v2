"use server";
import { db } from "@/db";
import { watchHistory, categoryEnum } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

type Category = (typeof categoryEnum.enumValues)[number];

async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function recordWatchHistory(payload: {
  movie_id: string;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  category: Category;
  server: number;
  season_number?: number;
  episode_number?: number;
  progress?: number;
  duration?: number;
}) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await db
      .insert(watchHistory)
      .values({
        userId: user.id,
        movieId: payload.movie_id,
        title: payload.title,
        posterPath: payload.poster_path,
        backdropPath: payload.backdrop_path ?? null,
        category: payload.category,
        server: payload.server,
        seasonNumber: payload.season_number ?? null,
        episodeNumber: payload.episode_number ?? null,
        progress: payload.progress ?? 0,
        duration: payload.duration && payload.duration > 0 ? payload.duration : null,
        watchedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [
          watchHistory.userId,
          watchHistory.movieId,
          watchHistory.category,
        ],
        set: {
          server: payload.server,
          backdropPath: payload.backdrop_path ?? sql`${watchHistory.backdropPath}`,
          seasonNumber: payload.season_number ?? null,
          episodeNumber: payload.episode_number ?? null,
          progress:
            payload.progress !== undefined
              ? payload.progress
              : sql`CASE WHEN ${watchHistory.seasonNumber} IS DISTINCT FROM ${payload.season_number ?? null} OR ${watchHistory.episodeNumber} IS DISTINCT FROM ${payload.episode_number ?? null} THEN 0 ELSE ${watchHistory.progress} END`,
          duration:
            payload.duration !== undefined && payload.duration > 0
              ? payload.duration
              : sql`${watchHistory.duration}`,
          watchedAt: new Date(),
        },
      });

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Gagal menyimpan riwayat tontonan" };
  }
}

export async function getWatchHistory(
  limit = 20
): Promise<
  | { success: true; data: (typeof watchHistory.$inferSelect)[] }
  | { success: false; error: string }
> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: true, data: [] };
    }

    const history = await db.query.watchHistory.findMany({
      where: eq(watchHistory.userId, user.id),
      orderBy: [desc(watchHistory.watchedAt)],
      limit,
    });

    return { success: true, data: history };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to retrieve watch history" };
  }
}

export async function deleteWatchHistoryItem(id: string) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await db
      .delete(watchHistory)
      .where(and(eq(watchHistory.id, id), eq(watchHistory.userId, user.id)));

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to delete history" };
  }
}

export async function clearWatchHistory() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await db.delete(watchHistory).where(eq(watchHistory.userId, user.id));
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to delete all history" };
  }
}
