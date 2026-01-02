"use cache";

export const tags = ["tmdb"];

export async function getMovies(apiUrl: string, page?: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}${apiUrl}?page=${page}`,
    {
      cache: "force-cache",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch TMDB data");
  }

  return res.json();
}
