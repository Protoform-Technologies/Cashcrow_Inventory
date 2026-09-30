'use client'

import React from 'react'
import { Search, Calendar, X, Filter } from 'lucide-react'

interface LogFiltersProps {
    search: string
    onSearchChange: (value: string) => void
    dateFilter: string
    onDateChange: (value: string) => void
    onClear: () => void
}

export default function LogFilters({
    search,
    onSearchChange,
    dateFilter,
    onDateChange,
    onClear
}: LogFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            {/* Search Input */}
            <div className="relative flex-1 w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[var(--color-cashcrow-primary)] transition-colors" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by part name, SKU, or member..."
                    className="w-full pl-10 pr-6 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 transition-all"
                />
            </div>

            {/* Date Container */}
            <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-56 group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[var(--color-cashcrow-primary)] transition-colors" />
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => onDateChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 transition-all cursor-pointer"
                    />
                </div>

                {/* Reset Button */}
                {(search || dateFilter) && (
                    <button
                        onClick={onClear}
                        className="p-2.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-all active:scale-95 group"
                        title="Clear Filters"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
                
            </div>
        </div>
    )
}
