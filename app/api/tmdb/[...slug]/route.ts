import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Logoprops, MovieItem } from "@/app/types";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await context.params;
    const fullPath = slug.join("/");
    const searchParams = new URL(req.url).searchParams;
    const query = searchParams.toString();

    const baseUrl = `${process.env.TMDB_API}/${fullPath}?${query}`;

    const res = await fetch(baseUrl, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      },
      next: { revalidate: 3600 }, // cache 1 jam
    });

    const data = await res.json();

    // 🔥 hanya jalan kalau endpoint movie list
    if (fullPath.startsWith("movie") && data.results) {
      const results = await Promise.all(
        data.results.slice(0, 10).map(async (movie: MovieItem) => {
          try {
            const imgRes = await fetch(
              `${process.env.TMDB_API}/movie/${movie.id}/images`,
              {
                headers: {
                  accept: "application/json",
                  Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
                },
                next: { revalidate: 3600 },
              }
            );

            const imgData = await imgRes.json();

            const logo =
              imgData.logos?.find((l: Logoprops) => l.iso_639_1 === "en") ||
              imgData.logos?.[0];

            return {
              ...movie,
              logo: logo
                ? `https://image.tmdb.org/t/p/original${logo.file_path}`
                : null,
            };
          } catch {
            return {
              ...movie,
              logo: null,
            };
          }
        })
      );

      return NextResponse.json({
        ...data,
        results,
      });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.log("Unexpected error", err);
    return NextResponse.error();
  }
}
