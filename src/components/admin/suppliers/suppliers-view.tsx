'use client'

import { useState, useMemo } from 'react'
import SuppliersHeader from './suppliers-header'
import SuppliersGrid from './suppliers-grid'
import SuppliersPagination from './suppliers-pagination'
import SupplierStats from './supplier-stats'
import SupplierDetailModal from './supplier-detail-modal'

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
}

export default function SuppliersView({
    suppliers: initialSuppliers,
    totalCount,
    currentPage,
    totalPages
}: SuppliersViewProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [showStats, setShowStats] = useState(true)
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

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

    // Calculate stats
    const stats = useMemo(() => {
        if (initialSuppliers.length === 0) return { avgLeadTime: 0, categoryCount: 0 }

        const totalLeadTime = initialSuppliers.reduce((acc, s) => acc + (s.lead_time || 0), 0)
        const categories = new Set(initialSuppliers.map(s => s.category).filter(Boolean))

        return {
            avgLeadTime: Math.round(totalLeadTime / initialSuppliers.length * 10) / 10,
            categoryCount: categories.size
        }
    }, [initialSuppliers])

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
                    totalCount={totalCount}
                    categoryCount={stats.categoryCount}
                    averageLeadTime={stats.avgLeadTime}
                />
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
                <SuppliersGrid
                    suppliers={filteredSuppliers}
                    searchQuery={searchQuery}
                    onSupplierClick={setSelectedSupplier}
                />

                <SuppliersPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    limit={6}
                />
            </div>

            {selectedSupplier && (
                <SupplierDetailModal
                    supplier={selectedSupplier}
                    onClose={() => setSelectedSupplier(null)}
                />
            )}
        </div>
    )
}
