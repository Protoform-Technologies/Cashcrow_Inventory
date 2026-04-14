export type TransactionType = 'IN' | 'OUT' | 'RETURN' | 'ADJUST' | 'SCRAP'
export type LogStatus = 'DRAFT' | 'SUBMITTED'

export interface Product {
    id: string
    name: string
    sku: string
    category: string
    quantity: number
    image_url?: string | null
}

export interface Member {
    id: string
    first_name: string
    last_name: string
    email?: string
    role: string
    avatar_url?: string | null
}

export interface DayLogEntry {
    id: string
    productId: string
    productName: string
    productSku: string
    quantity: number
    transactionType: TransactionType
    takenBy: string
    takenByName: string
    purpose: string
    notes?: string
}

export interface DayLog {
    id: string
    created_by: string
    status: LogStatus
    notes?: string
    created_at: string
    day_log_items: DayLogItem[]
    profiles?: Member // Log creator
}

export interface DayLogItem {
    id: string
    day_log_id: string
    part_id: string
    type: TransactionType
    qty: number
    taken_by: string
    purpose: string
    notes?: string
    created_at: string
    products: {
        name: string
        sku: string
        quantity: number
    }
    taken_by_name?: string | null
}

export interface LogEntry {
    id: string
    productId: string
    productName: string
    productSku: string
    quantity: number
    transactionType: TransactionType
    takenBy: string
    takenByName: string
    purpose: string
}

export function generateEntryId() {
    return Math.random().toString(36).substr(2, 9)
}

export const INITIAL_ENTRY: LogEntry = {
    id: '1',
    productId: '',
    productName: '',
    productSku: '',
    quantity: 0,
    transactionType: 'OUT',
    takenBy: '',
    takenByName: '',
    purpose: ''
}
