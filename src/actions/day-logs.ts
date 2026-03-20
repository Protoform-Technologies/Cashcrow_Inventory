'use server'

import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export interface DayLogEntry {
    id?: string
    productId: string
    productName: string
    productSku: string
    quantity: number
    transactionType: 'IN' | 'OUT' | 'RETURN' | 'ADJUST' | 'SCRAP'
    takenBy: string
    takenByName: string
    purpose: string
    notes?: string
}

export interface DayLog {
    id: string
    created_by: string
    status: 'DRAFT' | 'SUBMITTED'
    notes?: string
    created_at: string
    items?: DayLogEntry[]
}

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

export async function getDayLogs(userId: string): Promise<DayLog[]> {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
        .from('day_logs')
        .select(`
            *,
            day_log_items (
                id,
                part_id,
                type,
                qty,
                taken_by,
                purpose,
                notes,
                created_at,
                products:part_id (
                    name,
                    sku
                )
            )
        `)
        .eq('created_by', userId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching day logs:', error)
        return []
    }

    return data || []
}

export async function getDayLogById(logId: string): Promise<DayLog | null> {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
        .from('day_logs')
        .select(`
            *,
            day_log_items (
                id,
                part_id,
                type,
                qty,
                taken_by,
                purpose,
                notes,
                created_at,
                products:part_id (
                    name,
                    sku,
                    quantity
                )
            )
        `)
        .eq('id', logId)
        .single()

    if (error) {
        console.error('Error fetching day log:', error)
        return null
    }

    return data
}

export async function saveDayLogDraft(
    dayLogId: string | null,
    entries: DayLogEntry[],
    userId: string,
    notes?: string
): Promise<{ id: string } | { error: string }> {
    const supabase = await createServerSupabaseClient()

    let logId = dayLogId

    // If no log exists, create one
    if (!logId) {
        const { data, error } = await supabase
            .from('day_logs')
            .insert({
                created_by: userId,
                status: 'DRAFT',
                notes: notes || null
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating day log:', error)
            return { error: error.message }
        }

        logId = data.id
    } else {
        // Update existing log notes
        await supabase
            .from('day_logs')
            .update({ notes: notes || null })
            .eq('id', logId)
    }

    // Delete existing items and insert new ones
    await supabase
        .from('day_log_items')
        .delete()
        .eq('day_log_id', logId)

    if (entries.length > 0) {
        const itemsToInsert = entries
            .filter(entry => entry.productId && entry.quantity > 0)
            .map(entry => ({
                day_log_id: logId,
                part_id: entry.productId,
                type: entry.transactionType,
                qty: entry.quantity,
                taken_by: entry.takenBy || null,
                purpose: entry.purpose || null,
                notes: entry.notes || null
            }))

        if (itemsToInsert.length > 0) {
            const { error: insertError } = await supabase
                .from('day_log_items')
                .insert(itemsToInsert)

            if (insertError) {
                console.error('Error saving day log items:', insertError)
                return { error: insertError.message }
            }
        }
    }

    revalidatePath('/admin/daily-log')
    return { id: logId as string }
}

export async function getProductRecentLogs(productId: string) {
    return getProductFullHistory(productId, 1, 5)
}

export async function getProductFullHistory(productId: string, page: number = 1, limit: number = 20) {
    const supabase = await createServerSupabaseClient()
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
        .from('day_log_items')
        .select(`
            *,
            day_logs!day_log_id_fkey (
                created_at
            ),
            products!part_id_fkey (
                name,
                sku
            ),
            profiles!taken_by_fkey (
                first_name,
                last_name
            )
        `, { 
            count: 'exact',
            head: false 
        })
        .eq('part_id', productId)
.order('day_logs.created_at.desc')
        .range(from, to)

    if (error) {
        console.error('Error fetching product history:', error)
        return { logs: [], total: 0 }
    }

    // Format for table
    const logs = (data || []).map(item => ({
        time: new Date(item.day_logs.created_at).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        }),
        date: new Date(item.day_logs.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        }),
        partName: item.products?.name || item.products?.sku || 'Unknown',
        quantity: item.qty,
        type: item.type,
        sign: (item.type === 'OUT' || item.type === 'SCRAP') ? '-' : '+',
        takenBy: item.profiles ? `${item.profiles.first_name} ${item.profiles.last_name}`.trim() : 'Unknown',
        purpose: item.purpose || ''
    }))

    return { logs, total: count || 0 }
}

export async function deleteDayLog(logId: string): Promise<{ success: boolean } | { error: string }> {
    // Use admin client to bypass RLS policies for deletion
    const supabase = getSupabaseAdmin()

    // Try to delete the log directly. The items should be deleted via CASCADE
    const { error: deleteLogError } = await supabase
        .from('day_logs')
        .delete()
        .eq('id', logId)

    if (deleteLogError) {
        console.error('Error deleting day log:', deleteLogError)
        
        // If direct delete fails, try updating status first
        const { error: statusError } = await supabase
            .from('day_logs')
            .update({ status: 'DRAFT' })
            .eq('id', logId)
            
        if (statusError) {
            // Try using RPC to delete (requires database function to exist)
            try {
                const { error: rpcError } = await supabase.rpc('delete_day_log_with_items', { 
                    p_log_id: logId 
                })
                
                if (rpcError) {
                    console.error('RPC delete failed:', rpcError)
                    return { error: 'Cannot delete submitted log. The database has a trigger preventing deletion.' }
                }
                
                revalidatePath('/admin/daily-log')
                return { success: true }
            } catch (e) {
                return { error: 'Cannot delete submitted log. Please run the SQL migration to fix this.' }
            }
        }
        
        // Now try deleting again after status change
        const { error: retryDeleteError } = await supabase
            .from('day_logs')
            .delete()
            .eq('id', logId)
            
        if (retryDeleteError) {
            return { error: retryDeleteError.message }
        }
    }

    revalidatePath('/admin/daily-log')
    return { success: true }
}

