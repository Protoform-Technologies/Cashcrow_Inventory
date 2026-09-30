import { Package, AlertTriangle, AlertCircle, History } from "lucide-react"
import { KPICard, type KPICardProps } from "@/components/ui/kpi-card"

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
    const cards: KPICardProps[] = [
        {
            label: "Total Parts",
            value: stats?.totalParts.toLocaleString() ?? "0",
            icon: Package,
            tone: "info",
            badge: "Active",
            subtext: "Inventory tracking active",
        },
        {
            label: "Low Stock",
            value: stats?.lowStock ?? 0,
            icon: AlertTriangle,
            tone: "warning",
            badge: "Attention",
            subtext: "Requires replenishment",
        },
        {
            label: "Out of Stock",
            value: stats?.outOfStock ?? 0,
            icon: AlertCircle,
            tone: "danger",
            badge: "Critical",
            subtext: "Impacts ongoing trials",
        },
        {
            label: "Recent Logs",
            value: stats?.recentLogs ?? 0,
            icon: History,
            tone: "primary",
            badge: "This week",
            subtext: "Last 7 days",
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {cards.map((card, i) => (
                <KPICard key={i} {...card} />
            ))}
        </div>
    )
}
