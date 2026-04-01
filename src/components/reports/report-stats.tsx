import React from "react";
import { TrendingUp, TrendingDown, Minus, IndianRupee, Activity, Zap, RefreshCw } from "lucide-react";

interface StatProps {
  label: string;
  value: string;
  trend: string;
  trendType: "up" | "down" | "down-good" | "neutral";
  icon: string;
}

const iconMap: Record<string, React.ReactNode> = {
  payments: <IndianRupee className="w-5 h-5 text-primary" />,
  monitoring: <Activity className="w-5 h-5 text-primary" />,
  speed: <Zap className="w-5 h-5 text-primary" />,
  autorenew: <RefreshCw className="w-5 h-5 text-primary" />,
};

const StatCard = ({ label, value, trend, trendType, icon }: StatProps) => {
  const getTrendStyles = () => {
    switch (trendType) {
      case "up":
      case "down-good":
        return "text-emerald-600 bg-emerald-50";
      case "down":
        return "text-rose-600 bg-rose-50";
      default:
        return "text-slate-500 bg-slate-50";
    }
  };

  const getTrendIcon = () => {
    if (trendType === "up") return <TrendingUp className="w-3.5 h-3.5" />;
    if (trendType === "down" || trendType === "down-good") return <TrendingDown className="w-3.5 h-3.5" />;
    return <Minus className="w-3.5 h-3.5" />;
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 transition-all hover:border-primary/30">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        <div className="p-1.5 md:p-2 bg-slate-50 rounded-lg">
          {iconMap[icon] || iconMap.monitoring}
        </div>
      </div>
      <h3 className="text-xl md:text-2xl font-black text-slate-900">{value}</h3>
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] md:text-[12px] font-bold w-fit ${getTrendStyles()}`}>
        {getTrendIcon()}
        <span>{trend}</span>
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
