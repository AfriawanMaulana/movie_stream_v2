import { getUserStats } from "@/app/actions/manageUsers";
import StatsCards from "@/app/components/dashboard/StatsCards";

export default async function DashboardPage() {
  const stats = await getUserStats();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>
      <StatsCards
        total={stats.total}
        premium={stats.premium}
        banned={stats.banned}
      />
    </div>
  );
}
