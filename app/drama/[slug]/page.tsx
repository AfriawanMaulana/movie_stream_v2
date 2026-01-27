import DramaDetail from "../components/DramaDetail";

type SearchParams = {
  id: string;
  ep?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const dramaId = params.id;
  const episodeId = params.ep;
  return <DramaDetail id={`${dramaId}`} ep={`${episodeId}`} />;
}
