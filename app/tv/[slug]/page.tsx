import TvDetail from "@/app/components/TvDetail";
import TVDetailSkeleton from "@/app/components/TVDetailSkeleton";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<TVDetailSkeleton />}>
      <TvDetail />
    </Suspense>
  );
}
