'use client'

import Link from 'next/link'
import { Search, PlusCircle, LayoutDashboard, Eye, EyeOff } from 'lucide-react'

interface SuppliersHeaderProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
    productName?: string
    showStats: boolean
    setShowStats: (show: boolean) => void
}

export default function SuppliersHeader({
    searchQuery,
    setSearchQuery,
    productName,
    showStats,
    setShowStats
}: SuppliersHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Suppliers</h2>
                <p className="text-slate-500 font-medium mt-1">
                    Manage and track your inventory source partners
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none sm:min-w-[280px]">
                    <input
                        id="supplier-search"
                        name="supplier-search"
                        type="search"
                        placeholder={`Search suppliers${productName ? ` for "${productName}"` : ''}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] bg-slate-50/50 focus:bg-white text-sm transition-all"
                        autoComplete="off"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                
                <button
                    onClick={() => setShowStats(!showStats)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm border ${
                        showStats 
                        ? 'bg-white text-[var(--color-cashcrow-primary)] border-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-primary)]/5' 
                        : 'bg-[var(--color-cashcrow-primary)] text-white border-[var(--color-cashcrow-primary)] hover:opacity-90'
                    }`}
                >
                    {showStats ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span className="hidden md:inline">{showStats ? 'Hide Stats' : 'Show Stats'}</span>
                </button>

                <Link 
                    href="/admin/add-suppliers" 
                    className="flex items-center gap-2 bg-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-lightgreen)] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-all whitespace-nowrap"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Supplier</span>
                    <span className="sm:hidden">Add</span>
                </Link>
            </div>
        </div>
    )
}
