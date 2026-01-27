import DramaDetail from "../components/DramaDetail";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id: string; ep?: string }>;
}) {
  const params = await searchParams;
  const dramaId = params.id;
  const episodeId = params.ep;
  return <DramaDetail id={`${dramaId}`} ep={`${episodeId}`} />;
}
