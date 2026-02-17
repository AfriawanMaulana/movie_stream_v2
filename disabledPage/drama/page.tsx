export const dynamic = "force-dynamic";
import { Suspense } from "react";
import MovieSkeleton from "../../app/components/MovieSkeleton";
import DramaList from "./components/DramaList";
import { getDramas } from "@/lib/dramabos/getDramas";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; get?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 20;

  const data = await getDramas(
    `/api/dramabos/dotdrama/api/drama/list`,
    page,
    limit
  );

  return (
    <div>
      <title>Drama - TERFLIX</title>
      <section className="px-5 lg:px-14 py-20">
        <Suspense fallback={<MovieSkeleton />}>
          <DramaList data={data} header="RECENTLY ADDED" isPagination />
        </Suspense>
      </section>
    </div>
  );
}
