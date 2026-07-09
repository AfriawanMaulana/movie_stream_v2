import type { Metadata } from "next";
import TvDetail from "@/app/components/TvDetail";

async function getTv(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tmdb/tv/${id}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return null;
  return res.json();
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const { id } = await searchParams;

  if (!id) return { title: "Episode Not Found" };

  const tv = await getTv(id);
  if (!tv) return { title: "Episode Not Found" };

  const match = slug.match(/season-(\d+)-episode-(\d+)/);
  const season_number = match?.[1];
  const episode_number = match?.[2];

  const title = `${tv.name} - Season ${season_number} Episode ${episode_number}`;
  const description = tv.overview?.slice(0, 160) || `Watch ${tv.name} online.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const { id } = await searchParams;

  const match = slug.match(/season-(\d+)-episode-(\d+)/);
  const season_number = match?.[1];
  const episode_number = match?.[2];

  const tv = id ? await getTv(id) : null;

  if (!tv) {
    return <div className="py-20 text-center">TV show not found.</div>;
  }

  return (
    <TvDetail
      tv={tv}
      specific={`${season_number}/${episode_number}`}
      showVideo
    />
  );
}
