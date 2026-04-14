'use server'

import { DayLogEntry, DayLog, TransactionType } from '@/types/day-logs'

import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function createDayLog(userId: string): Promise<{ id: string } | { error: string }> {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
        .from('day_logs')
        .insert({
            created_by: userId,
            status: 'DRAFT'
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating day log:', error)
        return { error: error.message }
    }

    return { id: data.id }
}

export async function addDayLogItems(
    dayLogId: string,
    entries: DayLogEntry[],
    userId: string
): Promise<{ success: boolean } | { error: string }> {
    const supabase = await createServerSupabaseClient()

    // First verify the log is still in DRAFT status and belongs to the user
    const { data: existingLog } = await supabase
        .from('day_logs')
        .select('id, status, created_by')
        .eq('id', dayLogId)
        .single()

    if (!existingLog) {
        return { error: 'Log not found' }
    }

    if (existingLog.status !== 'DRAFT') {
        return { error: 'Cannot modify a submitted log' }
    }

    if (existingLog.created_by !== userId) {
        return { error: 'You can only modify your own logs' }
    }

    // Delete existing items for this log first (to handle updates)
    await supabase
        .from('day_log_items')
        .delete()
        .eq('day_log_id', dayLogId)

    // Insert new items
    const itemsToInsert = entries.map(entry => ({
        day_log_id: dayLogId,
        part_id: entry.productId,
        type: entry.transactionType,
        qty: entry.quantity,
        taken_by: entry.takenBy,
        purpose: entry.purpose,
        notes: entry.notes || null
    }))

    const { error: insertError } = await supabase
        .from('day_log_items')
        .insert(itemsToInsert)

    if (insertError) {
        console.error('Error adding day log items:', insertError)
        return { error: insertError.message }
    }

    revalidatePath('/admin/daily-log')
    return { success: true }
}

export async function submitDayLog(dayLogId: string): Promise<{ success: boolean } | { error: string }> {
    const supabase = await createServerSupabaseClient()

    // First update the log status to SUBMITTED
    const { error: updateError } = await supabase
        .from('day_logs')
        .update({ status: 'SUBMITTED' })
        .eq('id', dayLogId)
        .eq('status', 'DRAFT')

    if (updateError) {
        console.error('Error submitting day log:', updateError)
        return { error: updateError.message }
    }

    // Get all items for this log to update product quantities
    const { data: items } = await supabase
        .from('day_log_items')
        .select('*')
        .eq('day_log_id', dayLogId)

    if (items && items.length > 0) {
        // Update product quantities based on transaction type
        for (const item of items) {
            let quantityChange = 0

            switch (item.type) {
                case 'IN':
                case 'RETURN':
                    quantityChange = item.qty
                    break
                case 'OUT':
                case 'SCRAP':
                    quantityChange = -item.qty
                    break
                case 'ADJUST':
                    // For ADJUST, we need to handle this differently
                    // For now, let's treat it as OUT
                    quantityChange = -item.qty
                    break
            }

            if (quantityChange !== 0) {
                // Get current quantity
                const { data: product } = await supabase
                    .from('products')
                    .select('quantity')
                    .eq('id', item.part_id)
                    .single()

                if (product) {
                    const newQuantity = Math.max(0, product.quantity + quantityChange)
                    await supabase
                        .from('products')
                        .update({ quantity: newQuantity })
                        .eq('id', item.part_id)
                }
            }
        }
    }

    revalidatePath('/admin/daily-log')
    revalidatePath('/admin/parts')
    return { success: true }
}


/**
 * ATOMIC SUBMISSION PROTOCOL:
 * Each entry is now treated as its own independent DayLog.
 */
export async function submitAtomicLogs(
    entries: DayLogEntry[],
    userId: string,
    notes?: string
): Promise<{ success: boolean; count: number } | { error: string }> {
    const supabase = getSupabaseAdmin()

    // 1. Validation Logic
    const validEntries = entries.filter(e => e.productId && e.quantity > 0)
    if (validEntries.length === 0) {
        return { error: 'No valid line items found for submission.' }
    }

    try {
        let successCount = 0

        for (const entry of validEntries) {
            // A. Create independent DayLog record
            const { data: log, error: logError } = await supabase
                .from('day_logs')
                .insert({
                    created_by: userId,
                    status: 'SUBMITTED',
                    notes: notes || null
                })
                .select()
                .single()

            if (logError) throw new Error(`Log creation failed: ${logError.message}`)

            // B. Create Item record
            const { error: itemError } = await supabase
                .from('day_log_items')
                .insert({
                    day_log_id: log.id,
                    part_id: entry.productId,
                    type: entry.transactionType,
                    qty: entry.quantity,
                    taken_by: entry.takenBy || null,
                    purpose: entry.purpose || null,
                    notes: entry.notes || null
                })

            if (itemError) throw new Error(`Item insertion failed: ${itemError.message}`)

            // C. Update Inventory (Validation: Stock Awareness)
            let quantityChange = 0
            switch (entry.transactionType) {
                case 'IN':
                case 'RETURN':
                    quantityChange = entry.quantity
                    break
                case 'OUT':
                case 'SCRAP':
                case 'ADJUST':
                    quantityChange = -entry.quantity
                    break
            }

            if (quantityChange !== 0) {
                const { data: product } = await supabase
                    .from('products')
                    .select('quantity')
                    .eq('id', entry.productId)
                    .single()

                if (product) {
                    const newQuantity = Math.max(0, product.quantity + quantityChange)
                    await supabase
                        .from('products')
                        .update({ quantity: newQuantity })
                        .eq('id', entry.productId)
                }
            }

            successCount++
        }

        revalidatePath('/admin/daily-log')
        revalidatePath('/admin/parts')
        return { success: true, count: successCount }
    } catch (error: any) {
        console.error('Atomic Submission Error:', error)
        return { error: error.message || 'A critical error occurred during atomic submission.' }
    }
}

// Deprecated multi-item logic preserved for backward compatibility if needed, but not used by new UI
export async function deleteDayLog(logId: string) {
    const { deleteDayLogRecord } = await import('@/lib/day-logs-service')
    try {
        await deleteDayLogRecord(logId)
        revalidatePath('/admin/daily-log')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

// Re-export lib functions needed by server components
export async function getSubmittedLogsWithDetails() {
    const { getSubmittedLogsWithDetails: fetchLogs } = await import('@/lib/day-logs-service')
    return fetchLogs()
}

export async function getProductFullHistory(productId: string, page: number = 1, limit: number = 10) {
    const { getProductFullHistory: fetchHistory } = await import('@/lib/day-logs-service')
    return fetchHistory(productId, page, limit)
}
