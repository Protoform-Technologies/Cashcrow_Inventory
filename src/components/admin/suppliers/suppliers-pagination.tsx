'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface SuppliersPaginationProps {
    currentPage: number
    totalPages: number
    totalCount: number
    limit: number
}

export default function SuppliersPagination({
    currentPage,
    totalPages,
    totalCount,
    limit
}: SuppliersPaginationProps) {
    if (totalCount === 0) return null

    return (
        <div className="mt-8 p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between bg-white rounded-2xl shadow-sm gap-4">
            <p className="text-sm font-medium text-slate-500">
                Showing <span className="font-bold text-slate-800">{(currentPage - 1) * limit + 1}</span> to <span className="font-bold text-slate-800">{Math.min(currentPage * limit, totalCount)}</span> of <span className="font-bold text-slate-800">{totalCount}</span> results
            </p>
            <div className="flex items-center gap-2">
                <Link
                    href={`/admin/suppliers?page=${Math.max(1, currentPage - 1)}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all font-bold text-sm ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden xs:inline">Previous</span>
                </Link>
                <div className="hidden sm:flex items-center gap-1.5">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <Link
                            key={i}
                            href={`/admin/suppliers?page=${i + 1}`}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-[var(--color-cashcrow-primary)] text-white shadow-md shadow-[var(--color-cashcrow-primary)]/20' : 'hover:bg-slate-100 text-slate-600 border border-transparent hover:border-slate-200'}`}
                        >
                            {i + 1}
                        </Link>
                    ))}
                </div>
                <Link
                    href={`/admin/suppliers?page=${Math.min(totalPages, currentPage + 1)}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all font-bold text-sm ${currentPage >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <span className="hidden xs:inline">Next</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    )
}
