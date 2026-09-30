'use client'

import { useState, useMemo } from 'react'
import QuotesHeader from './quotes-header'
import QuotesTable from './quotes-table'
import QuotesPagination from './quotes-pagination'
import { QuoteRow } from '@/types/quote'

interface QuotesViewProps {
    quotes: QuoteRow[]
    totalCount: number
    currentPage: number
    totalPages: number
    limit: number
}

export default function QuotesView({
    quotes,
    totalCount,
    currentPage,
    totalPages,
    limit
}: QuotesViewProps) {
    const [searchQuery, setSearchQuery] = useState('')

    // Client-side filter over the currently loaded page (mirrors Suppliers).
    const filteredQuotes = useMemo(() => {
        const query = searchQuery.toLowerCase().trim()
        if (!query) return quotes
        return quotes.filter((quote) => {
            const author = `${quote.generated_by_profile?.first_name ?? ''} ${quote.generated_by_profile?.last_name ?? ''}`
            return (
                quote.name?.toLowerCase().includes(query) ||
                quote.request_id?.toLowerCase().includes(query) ||
                quote.quote_type?.toLowerCase().includes(query) ||
                quote.status?.toLowerCase().includes(query) ||
                author.toLowerCase().includes(query)
            )
        })
    }, [quotes, searchQuery])

    return (
        <div className="space-y-6">
            <QuotesHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
                <QuotesTable quotes={filteredQuotes} />

                <QuotesPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    limit={limit}
                />
            </div>
        </div>
    )
}
