import MovieDetail from "@/app/components/MovieDetail";
import { getDetailMovie } from "@/lib/tmdb/getDetailMovie";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { id } = await searchParams;
  if (!id) return { title: "Movie not found" };

  const movie = await getDetailMovie(id);
  if (!movie) return { title: "Movie not found" };

  return {
    title: movie.title,
    description: movie.overview,
    openGraph: {
      title: movie.title,
      description: movie.overview,
    },
  };
}

export default async function Page({ searchParams }: Props) {
  const { id } = await searchParams;

  if (!id) notFound();

  const movie = await getDetailMovie(id);

  if (!movie) notFound();

  return <MovieDetail movie={movie} />;
}
