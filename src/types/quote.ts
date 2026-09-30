export enum QuoteStatus {
    PENDING = 'Pending',
    ORDERED = 'Ordered',
    APPROVED = 'Approved',
    DENIED = 'Denied'
}

export enum QuoteType {
    PRODUCT = 'product',
    SERVICE = 'service'
}

/**
 * Shape returned by dbGetQuotes for the admin Quotes registry table.
 * Nullable fields exist because legacy rows (created before the schema
 * was extended in 05_quotes.sql) won't have name/type/vertical/author.
 */
export interface QuoteRow {
    id: string
    name: string | null
    quote_type: string | null
    vertical: string | null
    status: QuoteStatus
    request_id: string | null
    created_at: string
    generated_by_profile: {
        first_name: string | null
        last_name: string | null
    } | null
}
