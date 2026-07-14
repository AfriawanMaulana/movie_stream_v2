import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return { response, user: null, banned: false };
  }

  // Ganti Drizzle -> Supabase client, aman jalan di Edge Runtime
  const { data: profile } = await supabase
    .from("users")
    .select("role, username, avatar, is_banned")
    .eq("id", authUser.id)
    .single();

  if (profile?.is_banned) {
    await supabase.auth.signOut();
    return { response, user: null, banned: true };
  }

  return {
    response,
    user: {
      id: authUser.id,
      email: authUser.email,
      role: profile?.role ?? "user",
      username: profile?.username,
      avatar: profile?.avatar,
    },
    banned: false,
  };
}
