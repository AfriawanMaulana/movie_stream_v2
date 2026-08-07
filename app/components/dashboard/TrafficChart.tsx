"use client";

import { useState, useTransition } from "react";
import {
  getTrafficStats,
  PeriodType,
  TrafficStatsResponse,
} from "@/app/actions/analytics";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Eye,
  Users,
  Clock,
  Loader2,
} from "lucide-react";

interface TrafficChartProps {
  initialData: TrafficStatsResponse;
}

const PERIOD_LABELS: { key: PeriodType; label: string }[] = [
  { key: "day", label: "24 Hours" },
  { key: "week", label: "7 Days" },
  { key: "month", label: "30 Days" },
  { key: "year", label: "1 Year" },
  { key: "all", label: "All Time" },
];

export default function TrafficChart({ initialData }: TrafficChartProps) {
  const [data, setData] = useState<TrafficStatsResponse>(initialData);
  const [activePeriod, setActivePeriod] = useState<PeriodType>(
    initialData.period || "week"
  );
  const [isPending, startTransition] = useTransition();

  const handlePeriodChange = (period: PeriodType) => {
    setActivePeriod(period);
    startTransition(async () => {
      try {
        const updated = await getTrafficStats(period);
        setData(updated);
      } catch (err) {
        console.error("Failed to load traffic data:", err);
      }
    });
  };

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-wide">
              Website Traffic Analytics
            </h2>
            {isPending && (
              <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
            )}
          </div>
          <p className="text-xs text-white/50 mt-1">
            Monitor real-time user entries, total views, and unique visitors.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-[#121212] border border-white/10 rounded-xl p-1 gap-1 self-start md:self-auto">
          {PERIOD_LABELS.map((item) => (
            <button
              key={item.key}
              onClick={() => handlePeriodChange(item.key)}
              disabled={isPending}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activePeriod === item.key
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121212] border border-white/10 rounded-xl p-4 flex items-center gap-3">
          <div className="p-3 bg-red-600/10 text-red-500 rounded-lg border border-red-500/20">
            <Eye size={20} />
          </div>
          <div>
            <p className="text-xs text-white/50">Total Views</p>
            <p className="text-xl font-bold text-white mt-0.5">
              {data.totalViews.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-[#121212] border border-white/10 rounded-xl p-4 flex items-center gap-3">
          <div className="p-3 bg-cyan-600/10 text-cyan-400 rounded-lg border border-cyan-500/20">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-white/50">Unique Visitors</p>
            <p className="text-xl font-bold text-white mt-0.5">
              {data.uniqueVisitors.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-[#121212] border border-white/10 rounded-xl p-4 flex items-center gap-3">
          <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs text-white/50">Views Today</p>
            <p className="text-xl font-bold text-white mt-0.5">
              {data.todayViews.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-[#121212] border border-white/10 rounded-xl p-4 flex items-center gap-3">
          <div className="p-3 bg-amber-600/10 text-amber-400 rounded-lg border border-amber-500/20">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-xs text-white/50">Traffic Trend</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
              +{data.trendPercentage}%
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data.chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="uniquesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#ffffff"
              opacity={0.08}
            />
            <XAxis
              dataKey="label"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="views"
              name="Page Views"
              stroke="#dc2626"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#viewsGradient)"
            />
            <Area
              type="monotone"
              dataKey="uniques"
              name="Unique Visitors"
              stroke="#06b6d4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#uniquesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    name?: string;
    [key: string]: unknown;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#121212] border border-white/20 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-1">
        <p className="font-semibold text-white/80 border-b border-white/10 pb-1 mb-1">
          {label}
        </p>
        <div className="flex items-center gap-2 text-red-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
          <span>Page Views: {payload[0]?.value?.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-cyan-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" />
          <span>Unique Visitors: {payload[1]?.value?.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
}
