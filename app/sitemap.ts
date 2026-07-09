import { MetadataRoute } from "next";

const baseUrl = "https://terflix.web.id";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_TOKEN}`
  );

  const movies = await res.json();
  const results = (await movies.results) ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const movieUrls = results.map((movie: any) => ({
    url: `${baseUrl}/movie/${movie.id}`,
    lastModified: new Date(movie.release_date),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tv`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1,
    },
    ...movieUrls,
  ];
}
