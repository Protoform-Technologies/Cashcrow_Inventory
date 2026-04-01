





'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
    Search, 
    PlusCircle, 
    Building2, 
    ArrowLeft, 
    ArrowRight,
    ChevronRight
} from 'lucide-react'
import SupplierCard from '@/components/dashboard/supplier-card'
import SupplierDetailModal from '@/components/dashboard/supplier-detail-modal'
import SupplierStats from '@/components/dashboard/supplier-stats'

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
    created_at: string
}

interface SuppliersClientProps {
    suppliers: Supplier[]
    totalCount: number
    currentPage: number
    totalPages: number
    userName: string
}

export default function SuppliersClient({ 
    suppliers: initialSuppliers, 
    totalCount, 
    currentPage, 
    totalPages,
    userName 
}: SuppliersClientProps) {
    const [suppliers] = useState<Supplier[]>(initialSuppliers)
    const [searchQuery, setSearchQuery] = useState('')
// TODO: Remove product filter params once integrated
    // const searchParams = useSearchParams()
    // const productFilter = searchParams.get('product')
    // const productName = searchParams.get('name') || ''
    const productName: string = ''
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

    // Filter suppliers based on search query
    const filteredSuppliers = useMemo(() => {
        let query = searchQuery.toLowerCase()
        if (productName) query = productName.toLowerCase()
        if (!query) return suppliers
        return suppliers.filter(supplier => 
            supplier.company_name?.toLowerCase().includes(query) ||
            supplier.contact_name?.toLowerCase().includes(query) ||
            supplier.email?.toLowerCase().includes(query) ||
            supplier.category?.toLowerCase().includes(query)
        )
    }, [suppliers, searchQuery, productName])

    // Calculate average lead time
    const averageLeadTime = useMemo(() => {
        if (suppliers.length === 0) return 0
        const total = suppliers.reduce((acc, s) => acc + (s.lead_time || 0), 0)
        return Math.round(total / suppliers.length * 10) / 10
    }, [suppliers])

    // Active suppliers count
    const activeSuppliers = totalCount // Assuming all suppliers in DB are active

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Suppliers</h2>
                    <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Manage and track your inventory source partners</p>
                </div>
                <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none sm:w-64">
                        <input
                            id="supplier-search"
                            name="supplier-search"
                            type="search"
                            placeholder={`Search suppliers${productName ? ` for "${productName}"` : ''}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-2 rounded-lg md:rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] text-sm"
                            autoComplete="off"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        {productName && (
                            <p className="text-xs text-slate-500 mt-1 text-center">
                                Filtering for: <span className="font-semibold text-[var(--color-cashcrow-primary)]">{productName}</span>
                            </p>
                        )}
                    </div>
                    <Link href="/admin/add-suppliers" className="shrink-0 flex items-center gap-1.5 md:gap-2 bg-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-lightgreen)] text-white px-3 md:px-4 py-2 rounded-lg md:rounded-xl font-bold text-sm shadow-md transition-colors whitespace-nowrap">
                        <PlusCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Supplier</span>
                        <span className="sm:hidden">Add</span>
                    </Link>
                </div>
            </div>

            {/* Summary Cards - Moved Above */}
            <SupplierStats 
                totalCount={totalCount}
                activePartners={activeSuppliers}
                averageLeadTime={averageLeadTime}
            />

            {/* Supplier Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSuppliers.length === 0 ? (
                    <div className="col-span-full">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-inner mx-auto">
                                <Building2 className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">No suppliers found</h3>
                            <p className="text-slate-500 max-w-sm mb-6">
                                {searchQuery ? 'No suppliers match your search criteria.' : "You haven't added any suppliers yet."}
                            </p>
                            {!searchQuery && (
                                <Link href="/admin/add-suppliers" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors">
                                    <PlusCircle className="w-4 h-4" />
                                    Add First Supplier
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    filteredSuppliers.map(supplier => (
                        <SupplierCard 
                            key={supplier.id} 
                            supplier={supplier}
                            onClick={() => setSelectedSupplier(supplier)}
                        />
                    ))
                )}
            </div>

            {/* Pagination */}
            {filteredSuppliers.length > 0 && (
                <div className="mt-auto p-4 border-t border-slate-200 flex items-center justify-between bg-white rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Showing <span className="font-bold text-slate-800">{(currentPage - 1) * 6 + 1}</span> to <span className="font-bold text-slate-800">{Math.min(currentPage * 6, totalCount)}</span> of <span className="font-bold text-slate-800">{totalCount}</span> results
                    </p>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/admin/suppliers?page=${Math.max(1, currentPage - 1)}`}
                            className={`p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-600 transition-colors ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div className="hidden sm:flex items-center gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <Link
                                    key={i}
                                    href={`/admin/suppliers?page=${i + 1}`}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${currentPage === i + 1 ? 'bg-[var(--color-cashcrow-primary)] text-white' : 'hover:bg-slate-200 text-slate-600'}`}
                                >
                                    {i + 1}
                                </Link>
                            ))}
                        </div>
                        <Link
                            href={`/admin/suppliers?page=${Math.min(totalPages, currentPage + 1)}`}
                            className={`p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-600 transition-colors ${currentPage >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            )}

            {/* Supplier Detail Modal */}
            {selectedSupplier && (
                <SupplierDetailModal 
                    supplier={selectedSupplier}
                    onClose={() => setSelectedSupplier(null)}
                />
            )}
        </div>
    )
}

