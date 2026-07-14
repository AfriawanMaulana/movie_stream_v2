import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { response, user, banned } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const isAuthPage =
    pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");

  const protectedPaths = ["/profile"];
  const adminPaths = ["/dashboard"];

  const isProtectedPage = protectedPaths.some((p) => pathname.startsWith(p));
  const isAdminPage = adminPaths.some((p) => pathname.startsWith(p));

  // User di-ban -> paksa ke halaman banned, kecuali sudah di sana
  if (banned && pathname !== "/banned") {
    return NextResponse.redirect(new URL("/banned", request.url));
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  if (!user && isProtectedPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAdminPage && (!user || user.role !== "admin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // cek semua route
};
