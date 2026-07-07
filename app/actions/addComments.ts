"use server";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { getUser } from "./getUser";
import { comments } from "@/db/schema";

export async function addComments({
  message,
  movie_id,
  title,
  category,
}: {
  message: string;
  movie_id: string;
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
    await db.insert(comments).values({
      username: user.username,
      user_id: user.id,
      message,
      movie_id,
      title,
      category,
    });
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "Failed to add comment",
    };
  }

  return { success: true };
}

export async function getComments(movie_id: string) {
  try {
    return await db.query.comments.findMany({
      where: eq(comments.movie_id, movie_id),
    });
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getMyComments() {
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
      data: [],
    };
  }

  try {
    return await db.query.comments.findMany({
      where: eq(comments.user_id, user.id),
    });
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function deleteComments(id: string) {
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    await db
      .delete(comments)
      .where(and(eq(comments.id, id), eq(comments.user_id, user.id)));

    return { success: true, message: "Comment deleted successfully" };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "Failed to delete comment",
    };
  }
}
