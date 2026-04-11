'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { TrendingUp, FileText, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { Product } from '@/types/product'

interface ProductDetailHistoryProps {
    product: Product
    logs: any[]
    totalItems: number
    currentPage: number
    isAdmin?: boolean
}

export default function ProductDetailHistory({
    product,
    logs,
    totalItems,
    currentPage,
    isAdmin = false
}: ProductDetailHistoryProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const limit = 7
    const totalPages = Math.ceil(totalItems / limit)

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('p', newPage.toString())
        router.push(`?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-black text-slate-900 tracking-tight">Movement History</h2>
                    </div>
                </div>

                <div className="flex-1 divide-y divide-slate-50">
                    {logs.length > 0 ? logs.map((log, i) => (
                        <div key={i} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black ${log.type === 'IN' ? 'bg-emerald-50 text-emerald-600' :
                                    log.type === 'OUT' ? 'bg-blue-50 text-blue-600' :
                                        'bg-amber-50 text-amber-600'
                                    }`}>
                                    {log.sign}{log.quantity}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">{log.purpose || 'General Stock Update'}</p>
                                    <div className="flex flex-col gap-1.5 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-slate-300" /> {log.date}</span>
                                        <span className="flex items-center gap-1.5" title="User who consumed or moved the materials"><User className="w-3 h-3 text-slate-300" />{log.takenBy}</span>
                                    </div>
                                </div>
                            </div>
                            <span className={`shrink-0 px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${log.type === 'IN' ? 'bg-emerald-100 text-emerald-700' :
                                log.type === 'OUT' ? 'bg-blue-100 text-blue-700' :
                                    'bg-amber-100 text-amber-700'
                                }`}>
                                {log.type}
                            </span>
                        </div>
                    )) : (
                        <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                            No transaction logs found.
                        </div>
                    )}
                </div>

                {/* Pagination Footer */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Showing <span className="text-slate-900">{((currentPage - 1) * limit) + 1}</span> to <span className="text-slate-900">{Math.min(currentPage * limit, totalItems)}</span> of {totalItems}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg bg-white border border-slate-200 disabled:opacity-50 transition-all hover:bg-slate-50 active:scale-95"
                            >
                                <ChevronLeft className="w-4 h-4 text-slate-600" />
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg bg-white border border-slate-200 disabled:opacity-50 transition-all hover:bg-slate-50 active:scale-95"
                            >
                                <ChevronRight className="w-4 h-4 text-slate-600" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Notes Section */}
            {product.notes && (
                <div className="bg-amber-50/50 rounded-3xl border border-amber-100/50 p-6 space-y-3">
                    <div className="flex items-center gap-3 text-amber-700">
                        <FileText className="w-5 h-5" />
                        <h3 className="font-black uppercase tracking-widest text-[10px]">Administrative Notes</h3>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-xs italic">
                        "{product.notes}"
                    </p>
                </div>
            )}
        </div>
    )
}
