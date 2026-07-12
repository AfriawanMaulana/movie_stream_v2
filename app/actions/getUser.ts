"use server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { UserType } from "@/types/userType";

export async function getUser(): Promise<UserType | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  });

  if (!profile) return null;

  return {
    id: profile.id,
    username: profile.username,
    email: user.email!,
    role: profile.role,
    avatar: profile.avatar,
    createdAt: profile.createdAt,
  };
}
