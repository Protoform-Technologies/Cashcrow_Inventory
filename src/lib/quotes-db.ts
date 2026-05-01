import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'
import { QuoteStatus } from '@/types/quote'

/**
 * Database Layer for Quotes
 * Separates DB logic from Server Actions and Components
 */

export async function dbGetQuotes(page: number = 1, limit: number = 10, query?: string, startDate?: string, endDate?: string) {
    const supabase = await createServerSupabaseClient()
    const from = (page - 1) * limit
    const to = from + limit - 1

    let dbQuery = supabase
        .from('quotes')
        .select(`
            id,
            created_at,
            quantity,
            total_amount,
            status,
            request_id,
            expected_date,
            notes,
            suppliers!inner (
                company_name,
                contact_name,
                email
            ),
            products!quotes_product_id_fkey (
                name,
                sku
            )
        `, { count: 'exact' })

    if (query) {
        dbQuery = dbQuery.ilike('suppliers.company_name', `%${query}%`)
    }

    if (startDate) {
        dbQuery = dbQuery.gte('created_at', startDate)
    }

    if (endDate) {
        dbQuery = dbQuery.lte('created_at', endDate)
    }

    const { data, count, error } = await dbQuery
        .order('created_at', { ascending: false })
        .range(from, to)

    if (error) {
        console.error('[DB ERROR] dbGetQuotes:', error)
        throw error
    }

    return { 
        quotes: data || [], 
        count: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
    }
}

export async function dbCreateQuote(quoteData: {
    product_id: string
    supplier_id: string
    quantity: number
    total_amount?: number
    expected_date: string
    notes: string
    status: QuoteStatus
    request_id?: string
    details?: any
}) {
    const supabase = getSupabaseAdmin()
    const requestId = quoteData.request_id || `RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

    const { data, error } = await supabase
        .from('quotes')
        .insert([{
            ...quoteData,
            status: quoteData.status || QuoteStatus.PENDING,
            request_id: requestId,
            total_amount: quoteData.total_amount || 0,
            // If details is provided, we store it in notes as JSON for now to avoid schema breakage
            // unless we are sure the details column exists.
            notes: quoteData.details ? JSON.stringify(quoteData.details) : quoteData.notes
        }])
        .select()

    if (error) {
        console.error('[DB ERROR] dbCreateQuote:', error)
        throw error
    }

    return data[0]
}

export async function dbUpdateQuoteStatus(id: string, status: QuoteStatus) {
    // ALWAYS use admin client to ensure status updates bypass RLS if needed
    const supabase = getSupabaseAdmin()
    
    console.log(`[DB DIAGNOSIS] Updating quote ${id} to status: ${status}`)
    
    const { data, error } = await supabase
        .from('quotes')
        .update({ status })
        .eq('id', id)
        .select()

    if (error) {
        console.error('[DB ERROR] dbUpdateQuoteStatus:', error)
        throw error
    }

    if (!data || data.length === 0) {
        console.warn(`[DB WARNING] No record found to update for ID: ${id}`)
    }

    return data ? data[0] : null
}

export async function dbGetNextRequestId(prefix: string = 'RFQ') {
    const supabase = await createServerSupabaseClient()
    const now = new Date()
    const year = now.getFullYear()
    const monthString = (now.getMonth() + 1).toString().padStart(2, '0')
    const monthStart = new Date(year, now.getMonth(), 1).toISOString()
    
    // Count quotes with the same prefix for this month
    const { count, error } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .ilike('request_id', `${prefix}-${year}-${monthString}-%`)
        .gte('created_at', monthStart)

    if (error) {
        console.error('[DB ERROR] dbGetNextRequestId:', error)
        throw error
    }

    const nextSerial = (count || 0) + 1
    const serialString = nextSerial.toString().padStart(4, '0')
    
    return `${prefix}-${year}-${monthString}-${serialString}`
}
