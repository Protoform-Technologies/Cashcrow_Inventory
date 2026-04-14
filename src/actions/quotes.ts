'use server'

import { revalidatePath } from 'next/cache'
import { QuoteStatus } from '@/types/quote'
import { 
    dbGetQuotes, 
    dbCreateQuote, 
    dbUpdateQuoteStatus, 
    dbGetNextRequestId 
} from '@/lib/quotes-db'

export async function getQuotes(page: number = 1, limit: number = 10, query?: string, startDate?: string, endDate?: string) {
    try {
        return await dbGetQuotes(page, limit, query, startDate, endDate)
    } catch (error: any) {
        return { quotes: [], count: 0, error: error.message }
    }
}

export async function createQuote(quoteData: {
    product_id: string
    supplier_id: string
    quantity: number
    total_amount?: number
    expected_date: string
    notes: string
    status: QuoteStatus
    request_id?: string
}) {
    try {
        const data = await dbCreateQuote(quoteData)
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function updateQuoteStatus(id: string, status: QuoteStatus) {
    console.log(`[ACTION] Update status request for ${id} to ${status}`)
    try {
        const result = await dbUpdateQuoteStatus(id, status)
        if (result) {
            revalidatePath('/admin/quotes')
            return { success: true }
        }
        return { success: false, error: 'Update failed - no record found' }
    } catch (error: any) {
        console.error('[ACTION ERROR] updateQuoteStatus:', error)
        return { success: false, error: error.message }
    }
}

export async function getNextRequestId() {
    try {
        return await dbGetNextRequestId()
    } catch (error) {
        const year = new Date().getFullYear()
        const monthString = (new Date().getMonth() + 1).toString().padStart(2, '0')
        const random = Math.floor(1000 + Math.random() * 9000)
        return `RFQ-${year}-${monthString}-${random}`
    }
}

export async function getRecentQuotes() {
    const { quotes } = await getQuotes(1, 10)
    return quotes
}
