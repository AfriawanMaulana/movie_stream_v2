import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pageViews, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ success: true, ignored: true });
    }
    let body: { path?: string; visitorId?: string } = {};
    try {
      body = await request.json();
    } catch {
      // Body empty or invalid JSON
    }

    const path = body.path || "/";
    const visitorId = body.visitorId || "anonymous";

    // Ignore internal next framework paths, static assets, and admin paths
    if (
      path.startsWith("/_next") ||
      path.startsWith("/api") ||
      path.startsWith("/dashboard") ||
      path.includes(".")
    ) {
      return NextResponse.json({ success: true, ignored: true });
    }

    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const profile = await db.query.users.findFirst({
          where: eq(users.id, user.id),
        });
        if (profile?.role === "admin") {
          return NextResponse.json({ success: true, ignored: true });
        }
        userId = user.id;
      }
    } catch {
      // Unauthenticated visitor
    }

    await db.insert(pageViews).values({
      path,
      visitorId,
      userId: userId ?? undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging traffic:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log traffic" },
      { status: 500 }
    );
  }
}
