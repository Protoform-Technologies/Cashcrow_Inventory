import { Building2, Tags, Zap } from 'lucide-react'
import { KPICard } from '@/components/ui/kpi-card'

interface SupplierStatsProps {
    totalCount: number
    categoryCount: number
    fastestLeadTime: number
    fastestSupplier: string
}

export default function SupplierStats({ totalCount, categoryCount, fastestLeadTime, fastestSupplier }: SupplierStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 animate-in slide-in-from-top-4 duration-500">
            <KPICard
                label="Total Suppliers"
                value={totalCount}
                icon={Building2}
                tone="primary"
                subtext="Registered partners"
            />
            <KPICard
                label="Total Categories"
                value={categoryCount}
                icon={Tags}
                tone="warning"
                subtext="Industry segments"
            />
            <KPICard
                label="Fastest Lead Time"
                value={fastestLeadTime ? `${fastestLeadTime} Days` : '-'}
                icon={Zap}
                tone="info"
                subtext={fastestSupplier ? `${fastestSupplier} - quickest supplier` : 'Quickest supplier'}
            />
        </div>
    )
}
