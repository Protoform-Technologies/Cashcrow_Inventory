import { getQuotes } from '@/actions/quotes'
import QuotesView from '@/components/admin/quotes/quotes-view'
import { QuoteRow } from '@/types/quote'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Quotes | Cashcrow',
    description: 'Generate and track service and product quotes sent to clients and suppliers.',
}

export default async function QuotesPage(props: { searchParams: Promise<{ page?: string, q?: string }> }) {
    const searchParams = await props.searchParams
    const page = Number(searchParams.page) || 1
    const limit = 20
    const query = searchParams.q
    const { quotes, count } = await getQuotes(page, limit, query)
    const totalPages = Math.ceil((count || 0) / limit)

    return (
        <QuotesView
            quotes={(quotes as unknown as QuoteRow[]) || []}
            totalCount={count || 0}
            currentPage={page}
            totalPages={totalPages}
            limit={limit}
        />
    )
}
