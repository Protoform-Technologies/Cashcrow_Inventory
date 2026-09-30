'use client'

import { useState, useMemo } from 'react'
import SuppliersHeader from './suppliers-header'
import SuppliersGrid from './suppliers-grid'
import SuppliersPagination from './suppliers-pagination'
import SupplierStats from './supplier-stats'

interface Supplier {
    id: string
    company_name: string
    website: string | null
    contact_name: string | null
    email: string | null
    phone: string | null
    lead_time: number
    payment_terms: string
    category: string
    gst_no: string | null
    bank_account: string | null
    ifsc: string | null
    branch: string | null
    payment_id: string | null
    created_at: string
}

interface SuppliersViewProps {
    suppliers: Supplier[]
    totalCount: number
    currentPage: number
    totalPages: number
    stats: {
        totalSuppliers: number
        categoryCount: number
        fastestLeadTime: number
        fastestSupplier: string
    }
}

export default function SuppliersView({
    suppliers: initialSuppliers,
    totalCount,
    currentPage,
    totalPages,
    stats
}: SuppliersViewProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [showStats, setShowStats] = useState(true)

    // Filter suppliers based on search query
    const filteredSuppliers = useMemo(() => {
        const query = searchQuery.toLowerCase()
        if (!query) return initialSuppliers
        return initialSuppliers.filter(supplier =>
            supplier.company_name?.toLowerCase().includes(query) ||
            supplier.contact_name?.toLowerCase().includes(query) ||
            supplier.email?.toLowerCase().includes(query) ||
            supplier.category?.toLowerCase().includes(query)
        )
    }, [initialSuppliers, searchQuery])

    return (
        <div className="space-y-6">
            <SuppliersHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showStats={showStats}
                setShowStats={setShowStats}
            />

            {showStats && (
                <SupplierStats
                    totalCount={stats.totalSuppliers}
                    categoryCount={stats.categoryCount}
                    fastestLeadTime={stats.fastestLeadTime}
                    fastestSupplier={stats.fastestSupplier}
                />
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
                <SuppliersGrid
                    suppliers={filteredSuppliers}
                    searchQuery={searchQuery}
                />

                <SuppliersPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    limit={10}
                />
            </div>
        </div>
    )
}
