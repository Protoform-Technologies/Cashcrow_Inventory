import { Building2, Tags, Calendar } from 'lucide-react'

interface SupplierStatsProps {
    totalCount: number
    categoryCount: number
    averageLeadTime: number
}

export default function SupplierStats({ totalCount, categoryCount, averageLeadTime }: SupplierStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-in slide-in-from-top-4 duration-500">
            {/* Total Suppliers */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md group">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-cashcrow-primary)]/10 flex items-center justify-center mb-4">
                    <Building2 className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                </div>
                <p className="text-slate-500 text-xs font-semibold tracking-tight">Total Suppliers</p>
                <h3 className="text-2xl font-black mt-1 text-slate-900">{totalCount}</h3>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Registered partners</p>
            </div>
            
            {/* Total Categories */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md group">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                    <Tags className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-slate-500 text-xs font-semibold tracking-tight">Total Categories</p>
                <h3 className="text-2xl font-black mt-1 text-slate-900">{categoryCount}</h3>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Industry segments</p>
            </div>
            
            {/* Avg. Lead Time */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-slate-500 text-xs font-semibold tracking-tight">Avg. Lead Time</p>
                <h3 className="text-2xl font-black mt-1 text-slate-900">{averageLeadTime} Days</h3>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Fulfillment speed</p>
            </div>
        </div>
    )
}

