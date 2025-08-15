import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string[] }>},
) {
  try {
    const { slug } = await context.params;
    const fullPath = slug.join("/");
    const searchParams = new URL(req.url).searchParams;
    const query = searchParams.toString();
  
    const res = await fetch(`${process.env.TMDB_API}/${fullPath}?${query}`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      },
    });
  
    const data = await res.json();
    return NextResponse.json(data);

  } catch (err) {
    console.log('Unexpected error', err)
    return NextResponse.error()
  }
}
