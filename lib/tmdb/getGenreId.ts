type Genre = {
  id: number;
  name: string;
};

export async function getGenreId(slug: string): Promise<number> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tmdb/genre/movie/list`,
    {
      next: {
        revalidate: 60 * 60 * 24, // cache 24 jam (genre jarang berubah)
        tags: ["tmdb-genre"],
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch genre list");
  }

  const data: { genres: Genre[] } = await res.json();

  const normalizedSlug = slug.toLowerCase().replace(/-/g, " ");

  const genre = data.genres.find(
    (g) => g.name.toLowerCase() === normalizedSlug
  );

  if (!genre) {
    throw new Error(`Genre "${slug}" not found`);
  }

  return genre.id;
}
