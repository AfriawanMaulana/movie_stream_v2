import { getWatchHistory } from "@/app/actions/watchHistory";
import HistoryList from "@/app/components/HistoryList";
import { History } from "lucide-react";

export default async function WatchHistoryPage() {
  const result = await getWatchHistory();
  const history = result.success ? result.data : [];

  return (
    <section className="px-5 lg:px-14 pt-32 pb-20 space-y-6">
      <div className="flex gap-2 items-center border-b border-white/20 pb-4 mb-4">
        <History size={32} className="text-red-500" />
        <h1 className="text-2xl font-bold">Watch History</h1>
      </div>

      <HistoryList initialHistory={history} />
    </section>
  );
}
