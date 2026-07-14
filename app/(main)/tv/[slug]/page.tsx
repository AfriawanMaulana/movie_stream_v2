import TvDetail from "@/app/components/TvDetail";
import { getDetailTV } from "@/lib/tmdb/getDetailTV";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { id } = await searchParams;
  if (!id) return { title: "TV Series not found" };

  const tv = await getDetailTV(id);
  if (!tv) return { title: "TV Series not found" };

  return {
    title: tv.name,
    description: tv.overview,
    openGraph: {
      title: tv.name,
      description: tv.overview,
    },
  };
}

export default async function Page({ searchParams }: Props) {
  const { id } = await searchParams;

  if (!id) notFound();

  const tv = await getDetailTV(id);

  if (!tv) notFound();

  return <TvDetail tv={tv} />;
}
