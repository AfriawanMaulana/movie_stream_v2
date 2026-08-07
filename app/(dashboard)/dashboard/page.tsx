import { Suspense } from "react";
import { getUserStats } from "@/app/actions/manageUsers";
import { getTrafficStats } from "@/app/actions/analytics";
import StatsCards from "@/app/components/dashboard/StatsCards";
import TrafficChart from "@/app/components/dashboard/TrafficChart";
import {
  StatsCardsSkeleton,
  TrafficChartSkeleton,
} from "@/app/components/dashboard/DashboardSkeletons";

async function StatsSection() {
  const stats = await getUserStats();
  return (
    <StatsCards
      total={stats.total}
      premium={stats.premium}
      banned={stats.banned}
    />
  );
}

async function TrafficSection() {
  const initialTraffic = await getTrafficStats("week");
  return <TrafficChart initialData={initialTraffic} />;
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Dashboard Overview
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Real-time metrics and system traffic analytics.
        </p>
      </div>

      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsSection />
      </Suspense>

      <Suspense fallback={<TrafficChartSkeleton />}>
        <TrafficSection />
      </Suspense>
    </div>
  );
}
