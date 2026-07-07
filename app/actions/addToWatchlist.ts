"use server";
import { db } from "@/db";
import { watchlist } from "@/db/schema";
import { getUser } from "./getUser";
import { and, eq } from "drizzle-orm";

export async function addToWatchlist({
  movie_id,
  poster_path,
  title,
  category,
}: {
  movie_id: string;
  poster_path: string;
  title: string;
  category: "movie" | "tv";
}) {
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    const existing = await db.query.watchlist.findFirst({
      where: and(
        eq(watchlist.user_id, user.id),
        eq(watchlist.movie_id, movie_id)
      ),
    });

    if (existing) {
      await db
        .delete(watchlist)
        .where(
          and(eq(watchlist.user_id, user.id), eq(watchlist.id, existing.id))
        );
      return {
        success: true,
        isSaved: false,
        message: "Removed from watchlist",
      };
    } else {
      await db.insert(watchlist).values({
        user_id: user.id,
        movie_id,
        poster_path,
        title,
        category,
      });
      return {
        success: true,
        isSaved: true,
        message: "Added to watchlist",
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "Failed to add to watchlist",
    };
  }
}
export async function checkWatchlist(movieId: string) {
  const user = await getUser();

  if (!user) return false;

  const movie = await db.query.watchlist.findFirst({
    where: and(eq(watchlist.user_id, user.id), eq(watchlist.movie_id, movieId)),
  });

  return !!movie;
}
