import {
    Package,
    AlertTriangle,
    AlertCircle,
    History
} from "lucide-react"

interface DashboardStats {
    totalParts: number
    lowStock: number
    outOfStock: number
    recentLogs: number
}

interface StatsGridProps {
    stats?: DashboardStats
}

export default function StatsGrid({ stats }: StatsGridProps) {
    const statsConfig = [
        {
            label: "Total Parts",
            value: stats?.totalParts.toLocaleString() || "0",
            icon: (className: string) => <div className={`p-2 bg-blue-50 text-blue-600 rounded-xl ${className}`}><Package className="w-5 h-5" /></div>,
            subtext: "Inventory tracking active"
        },
        {
            label: "Low Stock",
            value: stats?.lowStock.toString() || "0",
            status: "Attention",
            trend: "warning",
            icon: (className: string) => <div className={`p-2 bg-orange-50 text-orange-600 rounded-xl ${className}`}><AlertTriangle className="w-5 h-5" /></div>,
            subtext: "Requires replenishment"
        },
        {
            label: "Out of Stock",
            value: stats?.outOfStock.toString() || "0",
            status: "Critical",
            trend: "danger",
            icon: (className: string) => <div className={`p-2 bg-red-50 text-red-600 rounded-xl ${className}`}><AlertCircle className="w-5 h-5" /></div>,
            subtext: "Impacts ongoing trials"
        },
        {
            label: "Recent Logs",
            value: stats?.recentLogs.toString() || "0",
            status: "Today",
            trend: "primary",
            icon: (className: string) => <div className={`p-2 bg-[#265136]/10 text-[#265136] rounded-xl ${className}`}><History className="w-5 h-5" /></div>,
            subtext: "Entries for today"
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsConfig.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-6">
                        {stat.icon("group-hover:scale-110 transition-transform")}
                        {stat.status && (
                            <span className={`text-[11px] font-black px-2 py-1 rounded-lg ${stat.trend === 'warning' ? 'bg-orange-50 text-orange-600' :
                                stat.trend === 'danger' ? 'bg-red-50 text-red-600' :
                                    'bg-[#265136]/10 text-[#265136]'
                                }`}>
                                {stat.status}
                            </span>
                        )}
                    </div>
                    <p className="text-slate-500 text-sm font-semibold tracking-tight">{stat.label}</p>
                    <h3 className="text-3xl font-black mt-1 text-slate-900">{stat.value}</h3>
                    <p className="text-[11px] text-slate-400 mt-2 font-medium">{stat.subtext}</p>
                </div>
            ))}
        </div>
    )
}
