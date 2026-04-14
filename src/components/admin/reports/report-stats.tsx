import React from "react";
import { TrendingUp, TrendingDown, Minus, IndianRupee, Activity, Package, Wallet } from "lucide-react";

interface StatProps {
  label: string;
  value: string;
  trend: string;
  trendType: "up" | "down" | "down-good" | "neutral";
  icon: string;
}

const iconMap: Record<string, React.ReactNode> = {
  payments: <IndianRupee className="w-5 h-5" />,
  monitoring: <Activity className="w-5 h-5" />,
  account_balance_wallet: <Wallet className="w-5 h-5" />,
  inventory_2: <Package className="w-5 h-5" />,
};

const StatCard = ({ label, value, trend, trendType, icon }: StatProps) => {
  const isPositive = trendType === "up" || trendType === "down-good";
  const isNeutral = trendType === "neutral";
  const isNegative = trendType === "down";

  // Check if we should show the trend symbol (hide for Total Inventory as requested)
  const isStatic = label.toLowerCase().includes("total inventory value") || label.toLowerCase().includes("stock items");

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
      <div className="flex justify-between items-start mb-6 w-full">
        <div className={`p-2 rounded-xl group-hover:scale-110 transition-transform ${
          icon === 'payments' ? 'bg-emerald-50 text-emerald-600' :
          icon === 'account_balance_wallet' ? 'bg-orange-50 text-orange-600' :
          icon === 'inventory_2' ? 'bg-blue-50 text-blue-600' :
          'bg-rose-50 text-rose-600'
        }`}>
          {iconMap[icon] || iconMap.monitoring}
        </div>

        {!isStatic && (
          <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
            isPositive ? 'bg-emerald-50 text-emerald-600' : 
            isNegative ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'
          }`}>
             {trendType === "up" && <TrendingUp className="w-3 h-3" />}
             {(trendType === "down" || trendType === "down-good") && <TrendingDown className="w-3 h-3" />}
             {isNeutral && <Minus className="w-3 h-3" />}
             {trend.split(" ")[0]}
          </span>
        )}
      </div>

      <div className="flex-1">
        <p className="text-slate-500 text-sm font-semibold tracking-tight">{label}</p>
        <h3 className="text-3xl font-black mt-1 text-slate-900 group-hover:text-[var(--color-cashcrow-primary)] transition-colors">{value}</h3>
        <p className="text-[11px] text-slate-400 mt-2 font-medium">{trend}</p>
      </div>
    </div>
  );
};

export default function ReportStats({ stats }: { stats: StatProps[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
