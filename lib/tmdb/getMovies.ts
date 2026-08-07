import { fetchDirectTMDB } from "./client";

export const tags = ["tmdb"];

export async function getMovies(apiUrl: string, page: number = 1) {
  // If apiUrl starts with /api/tmdb/, extract the inner path and search params
  let path = apiUrl;
  const paramObj: Record<string, string | number> = { page };

  if (apiUrl.startsWith("/api/tmdb/")) {
    path = apiUrl.replace("/api/tmdb/", "");
  }

  if (path.includes("?")) {
    const [cleanPath, queryString] = path.split("?");
    path = cleanPath;
    const urlParams = new URLSearchParams(queryString);
    urlParams.forEach((val, key) => {
      paramObj[key] = val;
    });
  }

  return fetchDirectTMDB(path, paramObj, 3600);
}
