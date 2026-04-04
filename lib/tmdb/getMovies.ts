"use cache";

export const tags = ["tmdb"];

export async function getMovies(apiUrl: string, page?: number) {
  const isParams = apiUrl.includes("?");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}${apiUrl}${
      isParams ? "&" : "?"
    }page=${page}`,
    {
      next: {
        revalidate: 300,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch TMDB data");
  }

  return res.json();
}
