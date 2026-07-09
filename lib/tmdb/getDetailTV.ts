export async function getDetailTV(id: string) {
  const res = await fetch(`https://api.themoviedb.org/3/tv/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
    next: {
      revalidate: 3600,
    },
  });

  if (!res.ok) return null;

  const data = await res.json();

  if (data.success === false) return null;

  return data;
}
