"use server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, ilike, or, count } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const PAGE_SIZE = 10;

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) throw new Error("Unauthorized");

  const profile = await db.query.users.findFirst({
    where: eq(users.id, authUser.id),
  });

  if (profile?.role !== "admin") throw new Error("Forbidden");

  return authUser;
}

export async function getUsersPaginated({
  page = 1,
  search = "",
}: {
  page?: number;
  search?: string;
}) {
  await requireAdmin();

  const offset = (page - 1) * PAGE_SIZE;

  const whereClause = search
    ? or(
        ilike(users.username, `%${search}%`),
        ilike(users.email, `%${search}%`)
      )
    : undefined;

  const [data, totalResult] = await Promise.all([
    db.query.users.findMany({
      where: whereClause,
      orderBy: (users, { desc }) => [desc(users.createdAt)],
      limit: PAGE_SIZE,
      offset,
    }),
    db.select({ count: count() }).from(users).where(whereClause),
  ]);

  const total = totalResult[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return {
    data,
    total,
    totalPages,
    currentPage: page,
    pageSize: PAGE_SIZE,
  };
}

export async function updateUserRole(
  userId: string,
  role: "user" | "premium" | "admin"
) {
  try {
    await requireAdmin();

    const updated = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .returning({ id: users.id, role: users.role });

    if (updated.length === 0) {
      // Ini akan membongkar penyebab aslinya
      console.error("Update tidak mengenai baris manapun. userId:", userId);
      return {
        success: false,
        error: "User tidak ditemukan atau gagal diupdate",
      };
    }

    revalidatePath("/dashboard/manage-users");
    return { success: true, message: "Role berhasil diperbarui" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Gagal memperbarui role" };
  }
}

export async function toggleBanUser(userId: string, isBanned: boolean) {
  try {
    await requireAdmin();
    await db
      .update(users)
      .set({ isBanned: !isBanned })
      .where(eq(users.id, userId));
    revalidatePath("/dashboard/manage-users");
    return {
      success: true,
      message: !isBanned ? "User berhasil di-ban" : "User berhasil di-unban",
    };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Gagal mengubah status ban" };
  }
}

export async function deleteUser(userId: string) {
  try {
    const admin = await requireAdmin();

    if (admin.id === userId) {
      return {
        success: false,
        error: "Kamu tidak bisa menghapus akunmu sendiri",
      };
    }

    await db.delete(users).where(eq(users.id, userId));
    revalidatePath("/dashboard/manage-users");
    return { success: true, message: "User berhasil dihapus" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Gagal menghapus user" };
  }
}

export async function getUserStats() {
  await requireAdmin();

  const [totalResult, premiumResult, bannedResult] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(users).where(eq(users.role, "premium")),
    db.select({ count: count() }).from(users).where(eq(users.isBanned, true)),
  ]);

  return {
    total: totalResult[0]?.count ?? 0,
    premium: premiumResult[0]?.count ?? 0,
    banned: bannedResult[0]?.count ?? 0,
  };
}
