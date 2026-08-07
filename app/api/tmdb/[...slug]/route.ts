import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchDirectTMDB } from "@/lib/tmdb/client";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await context.params;
    const fullPath = slug.join("/");
    const searchParams = new URL(req.url).searchParams;
    const paramObj: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      paramObj[key] = value;
    });

    const data = await fetchDirectTMDB(fullPath, paramObj, 3600);

    if (!data) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected error in TMDB route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
