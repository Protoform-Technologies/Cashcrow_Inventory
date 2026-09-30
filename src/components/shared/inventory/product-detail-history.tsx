'use client'

import React, { useState, useMemo } from 'react'
import { TrendingUp, FileText, Calendar, User, X } from 'lucide-react'
import { Product } from '@/types/product'
import { buttonStyles } from '@/components/ui/button'
import FilterSelect from '@/components/ui/filter-select'

interface ProductDetailHistoryProps {
    product: Product
    logs: any[]
}

// Per-movement-type styling so every transaction type is visually distinct.
const TYPE_CONFIG: Record<string, { label: string; sign: string; qty: string; badge: string }> = {
    IN: { label: 'Stock In', sign: '+', qty: 'bg-emerald-50 text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
    OUT: { label: 'Stock Out', sign: '-', qty: 'bg-blue-50 text-blue-600', badge: 'bg-blue-100 text-blue-700' },
    RETURN: { label: 'Returned', sign: '+', qty: 'bg-purple-50 text-purple-600', badge: 'bg-purple-100 text-purple-700' },
    ADJUST: { label: 'Adjusted', sign: '±', qty: 'bg-amber-50 text-amber-600', badge: 'bg-amber-100 text-amber-700' },
    SCRAP: { label: 'Scrapped', sign: '-', qty: 'bg-rose-50 text-rose-600', badge: 'bg-rose-100 text-rose-700' },
}
const DEFAULT_CFG = { label: 'Update', sign: '', qty: 'bg-slate-100 text-slate-600', badge: 'bg-slate-100 text-slate-600' }

const PAGE_SIZE = 8

const personOf = (log: any): string => log.taken_by_name || log.author || 'Unknown'

export default function ProductDetailHistory({ product, logs }: ProductDetailHistoryProps) {
    const [typeFilter, setTypeFilter] = useState('ALL')
    const [personFilter, setPersonFilter] = useState('ALL')
    const [periodFilter, setPeriodFilter] = useState('ALL')
    const [page, setPage] = useState(1)

    // Distinct people, for the person filter.
    const people = useMemo(() => {
        const set = new Set<string>()
        logs.forEach(l => set.add(personOf(l)))
        return Array.from(set).sort()
    }, [logs])

    const filtered = useMemo(() => {
        const now = Date.now()
        const windowMs = periodFilter === 'ALL' ? null : Number(periodFilter) * 86400000
        return logs.filter(l => {
            if (typeFilter !== 'ALL' && l.type !== typeFilter) return false
            if (personFilter !== 'ALL' && personOf(l) !== personFilter) return false
            if (windowMs && (now - new Date(l.created_at).getTime()) > windowMs) return false
            return true
        })
    }, [logs, typeFilter, personFilter, periodFilter])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const safePage = Math.min(page, totalPages)
    const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

    // Any filter change resets to page 1.
    const onFilter = (setter: (v: string) => void) => (v: string) => { setter(v); setPage(1) }
    const hasFilters = typeFilter !== 'ALL' || personFilter !== 'ALL' || periodFilter !== 'ALL'
    const clearFilters = () => { setTypeFilter('ALL'); setPersonFilter('ALL'); setPeriodFilter('ALL'); setPage(1) }

    return (
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
                {/* Header */}
                <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-black text-slate-900 tracking-tight">Movement History</h2>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                        {filtered.length}{hasFilters ? ` / ${logs.length}` : ''} entries
                    </span>
                </div>

                {/* Filter bar */}
                <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                        <FilterSelect
                            value={typeFilter}
                            onChange={onFilter(setTypeFilter)}
                            options={[
                                { id: 'ALL', label: 'All types' },
                                { id: 'IN', label: 'Stock In' },
                                { id: 'OUT', label: 'Stock Out' },
                                { id: 'RETURN', label: 'Returned' },
                                { id: 'ADJUST', label: 'Adjusted' },
                                { id: 'SCRAP', label: 'Scrapped' },
                            ]}
                        />
                    </div>
                    <div className="flex-1">
                        <FilterSelect
                            value={personFilter}
                            onChange={onFilter(setPersonFilter)}
                            options={[
                                { id: 'ALL', label: 'All people' },
                                ...people.map(p => ({ id: p, label: p })),
                            ]}
                        />
                    </div>
                    <div className="flex-1">
                        <FilterSelect
                            value={periodFilter}
                            onChange={onFilter(setPeriodFilter)}
                            options={[
                                { id: 'ALL', label: 'All time' },
                                { id: '7', label: 'Last 7 days' },
                                { id: '30', label: 'Last 30 days' },
                                { id: '90', label: 'Last 90 days' },
                            ]}
                        />
                    </div>
                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            title="Clear filters"
                            className="shrink-0 h-12 px-3 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Rows (compact) */}
                <div className="flex-1 divide-y divide-slate-50">
                    {pageItems.length > 0 ? pageItems.map((log, i) => {
                        const cfg = TYPE_CONFIG[log.type] || DEFAULT_CFG
                        return (
                            <div key={i} className="flex items-center gap-3 px-4 py-3.5 sm:py-2.5 hover:bg-slate-50/70 transition-colors">
                                <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-black ${cfg.qty}`}>
                                    {cfg.sign}{log.qty}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-900 truncate">{cfg.label}</span>
                                        {log.purpose && <span className="text-[11px] text-slate-400 truncate">· {log.purpose}</span>}
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 mt-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider min-w-0">
                                        <span className="flex items-center gap-1 whitespace-nowrap shrink-0"><Calendar className="w-3 h-3 text-slate-300 shrink-0" />{new Date(log.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        <span className="hidden sm:inline text-slate-300 shrink-0">·</span>
                                        <span className="flex items-center gap-1 min-w-0">
                                            <User className="w-3 h-3 text-slate-300 shrink-0" />
                                            <span className="truncate">{personOf(log)}</span>
                                        </span>
                                    </div>
                                </div>
                                <span className={`shrink-0 px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${cfg.badge}`}>{log.type}</span>
                            </div>
                        )
                    }) : (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-3">
                                <TrendingUp className="w-6 h-6 text-slate-300" />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                                {hasFilters ? 'No matching movements' : 'No movement yet'}
                            </p>
                            <p className="text-slate-400 text-[11px] mt-1">
                                {hasFilters ? 'Try adjusting or clearing the filters.' : 'This part has no recorded stock movements.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination — dashboard style */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
                        <p className="text-[12px] text-slate-500 font-bold lowercase tracking-wide">
                            Showing <span className="text-[var(--color-cashcrow-primary)] font-black">{(safePage - 1) * PAGE_SIZE + 1}</span> to <span className="text-[var(--color-cashcrow-primary)] font-black">{Math.min(safePage * PAGE_SIZE, filtered.length)}</span> of <span className="font-black">{filtered.length}</span> entries
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={safePage === 1}
                                className={buttonStyles({ variant: 'outline', size: 'sm' })}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={safePage >= totalPages}
                                className={buttonStyles({ variant: 'primary', size: 'sm' })}
                            >
                                Next
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
                        &quot;{product.notes}&quot;
                    </p>
                </div>
            )}
        </div>
    )
}
