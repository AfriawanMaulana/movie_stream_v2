"use server";

import { eq } from "drizzle-orm";
import { getUser } from "./getUser";
import { watchlist } from "@/db/schema";
import { db } from "@/db";

export async function getWatchlist() {
  const user = await getUser();
  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
      data: [],
    };
  }

  const result = await db.query.watchlist.findMany({
    where: eq(watchlist.user_id, user.id),
  });

  return {
    success: true,
    data: result,
  };
}
