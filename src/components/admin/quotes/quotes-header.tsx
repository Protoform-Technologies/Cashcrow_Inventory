'use client'

import { Search } from 'lucide-react'
import GenerateQuoteMenu from './generate-quote-menu'

interface QuotesHeaderProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
}

export default function QuotesHeader({ searchQuery, setSearchQuery }: QuotesHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Quotes</h2>
                <p className="text-slate-500 font-medium mt-1">
                    Track the service and product quotes generated for clients and suppliers
                </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none sm:min-w-[280px]">
                    <input
                        id="quote-search"
                        name="quote-search"
                        type="search"
                        placeholder="Search quotes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] bg-slate-50/50 focus:bg-white text-sm transition-all"
                        autoComplete="off"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <GenerateQuoteMenu />
            </div>
        </div>
    )
}
