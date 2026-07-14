import { Users, Crown, Ban } from "lucide-react";

type StatsCardsProps = {
  total: number;
  premium: number;
  banned: number;
};

export default function StatsCards({
  total,
  premium,
  banned,
}: StatsCardsProps) {
  const cards = [
    {
      label: "Total Users",
      value: total,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
    },
    {
      label: "Premium Users",
      value: premium,
      icon: Crown,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
    },
    {
      label: "Banned Users",
      value: banned,
      icon: Ban,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`flex items-center justify-between p-5 rounded-xl border ${card.bg} ${card.border}`}
          >
            <div>
              <p className="text-sm opacity-60">{card.label}</p>
              <p className="text-3xl font-bold mt-1">{card.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${card.bg} ${card.color}`}>
              <Icon size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
