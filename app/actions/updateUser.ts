"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { getUser } from "./getUser";
import { eq, and, ne } from "drizzle-orm";

export async function updateProfile({ username }: { username: string }) {
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const trimmedUsername = username.trim();

  if (trimmedUsername.length < 3) {
    return {
      success: false,
      error: "Username must be at least 3 characters.",
    };
  }

  try {
    await db
      .update(users)
      .set({
        username: trimmedUsername,
      })
      .where(eq(users.id, user.id));

    return {
      success: true,
      message: "Profile updated successfully.",
      user: updateProfile,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Failed to update profile.",
    };
  }
}
