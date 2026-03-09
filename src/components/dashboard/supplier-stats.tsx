'use client'

import { Building2, Truck, Calendar } from 'lucide-react'

interface SupplierStatsProps {
    totalCount: number
    activePartners: number
    averageLeadTime: number
}

export default function SupplierStats({ totalCount, activePartners, averageLeadTime }: SupplierStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl border border-primary/5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-cashcrow-primary)]/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Total Suppliers</p>
                </div>
                <h3 className="text-3xl font-black text-slate-900">{totalCount}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-primary/5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Truck className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Active Partners</p>
                </div>
                <h3 className="text-3xl font-black text-slate-900">{activePartners}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-primary/5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Avg. Lead Time</p>
                </div>
                <h3 className="text-3xl font-black text-slate-900">{averageLeadTime} Days</h3>
            </div>
        </div>
    )
}

