import { Logoprops, MovieItem } from "@/app/types";

const TMDB_API = process.env.TMDB_API || "https://api.themoviedb.org/3";
const TMDB_TOKEN = process.env.TMDB_TOKEN || "";

/**
 * Direct Server-Side TMDB API Fetcher.
 * Bypasses localhost HTTP loopbacks during SSR and caches TMDB responses for 1 hour.
 */
export async function fetchDirectTMDB(
  endpointPath: string,
  params: Record<string, string | number | boolean | undefined> = {},
  revalidateSeconds: number = 3600
) {
  const url = new URL(`${TMDB_API}${endpointPath.startsWith("/") ? "" : "/"}${endpointPath}`);
  
  let includeLogo = false;
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      if (key === "logo" && String(value) === "true") {
        includeLogo = true;
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  });

  const res = await fetch(url.toString(), {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
    next: { revalidate: revalidateSeconds },
  });

  if (!res.ok) {
    console.error(`TMDB Fetch failed (${res.status}): ${url.toString()}`);
    return null;
  }

  const data = await res.json();

  if (data?.results && Array.isArray(data.results)) {
    if (includeLogo) {
      const type = endpointPath.includes("movie") ? "movie" : "tv";
      // Limit logo sub-fetches to top 5 items max for fast TTFB
      const slicedResults = data.results.slice(0, 5);
      
      const resultsWithLogos = await Promise.all(
        slicedResults.map(async (movie: MovieItem) => {
          try {
            const imgRes = await fetch(`${TMDB_API}/${type}/${movie.id}/images`, {
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${TMDB_TOKEN}`,
              },
              next: { revalidate: 3600 },
            });
            if (!imgRes.ok) return { ...movie, logo: null };
            const imgData = await imgRes.json();
            const logo =
              imgData.logos?.find((l: Logoprops) => l.iso_639_1 === "en") ||
              imgData.logos?.[0];

            return {
              ...movie,
              logo: logo ? `https://image.tmdb.org/t/p/original${logo.file_path}` : null,
            };
          } catch {
            return { ...movie, logo: null };
          }
        })
      );

      const remainingResults = data.results.slice(5).map((m: MovieItem) => ({ ...m, logo: null }));

      return {
        ...data,
        results: [...resultsWithLogos, ...remainingResults],
      };
    } else {
      const results = data.results.map((movie: MovieItem) => ({
        ...movie,
        logo: null,
      }));
      return {
        ...data,
        results,
      };
    }
  }

  return data;
}
