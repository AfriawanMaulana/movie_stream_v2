import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  const pathname = request.nextUrl.pathname;

  const isAuthPage =
    pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");

  const isProtectedPage = ["/profile", "/watchlist"];

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  if (!user && isProtectedPage.includes(pathname)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/auth/:path*"],
};
