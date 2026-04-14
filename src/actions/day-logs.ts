'use server'

import { DayLogEntry, DayLog, TransactionType } from '@/lib/day-logs'

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
            day_logs!day_log_items_day_log_id_fkey (
                created_at,
                created_by
            ),
            products!day_log_items_part_id_fkey (
                name,
                sku
            )
        `, {
            count: 'exact',
            head: false
        })
        .eq('part_id', productId)
        .order('created_at', { ascending: false })
        .range(from, to)

    if (error) {
        console.error('Error fetching product history:', error)
        return { logs: [], total: 0 }
    }

    const userIds = Array.from(new Set((data || []).map(item => item.taken_by || (item.day_logs && item.day_logs.created_by)).filter(Boolean)))
    let profileMap: Record<string, any> = {}
    if (userIds.length > 0) {
        const adminClient = getSupabaseAdmin()
        const { data: profiles } = await adminClient
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', userIds)

        if (profiles) {
            profileMap = profiles.reduce((acc: any, p: any) => {
                acc[p.id] = p
                return acc
            }, {})
        }
    }

    // Format for table
    const logs = (data || []).map(item => {
        const takenByUserId = item.taken_by || (item.day_logs ? item.day_logs.created_by : null);
        const profile = takenByUserId ? profileMap[takenByUserId as string] : null;

        return {
            time: item.day_logs ? new Date(item.day_logs.created_at).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }) : 'Unknown',
            date: item.day_logs ? new Date(item.day_logs.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }) : 'Unknown',
            partName: item.products?.name || item.products?.sku || 'Unknown',
            quantity: item.qty,
            type: item.type,
            sign: (item.type === 'OUT' || item.type === 'SCRAP') ? '-' : '+',
            takenBy: profile ? `${profile.first_name} ${profile.last_name}`.trim() : 'Unknown',
            purpose: item.purpose || ''
        }
    })

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

export async function getSubmittedLogsWithDetails() {
    const adminClient = getSupabaseAdmin()

    // Fetch all submitted day logs using admin client
    const { data: submittedLogs, error: logsError } = await adminClient
        .from('day_logs')
        .select('*')
        .eq('status', 'SUBMITTED')
        .order('created_at', { ascending: false })

    if (logsError) {
        console.warn('Could not fetch submitted logs:', logsError.message)
        return []
    }

    if (!submittedLogs || submittedLogs.length === 0) return []

    // Fetch user profiles separately for the logs
    const logCreatorIds = submittedLogs.map((log: any) => log.created_by).filter(Boolean)
    const profileMap: Record<string, any> = {}

    if (logCreatorIds.length > 0) {
        const { data: profiles } = await adminClient
            .from('profiles')
            .select('id, first_name, last_name, email')
            .in('id', logCreatorIds)

        if (profiles) {
            profiles.forEach((profile: any) => { profileMap[profile.id] = profile })
        }
    }

    // Now loop over the logs and fetch the items (could optimize with an 'in' query)
    const logsWithItems: any[] = []

    for (const log of submittedLogs) {
        const { data: items } = await adminClient
            .from('day_log_items')
            .select('*')
            .eq('day_log_id', log.id)

        const itemsWithProducts: any[] = []
        if (items) {
            for (const item of items) {
                const { data: product } = await adminClient
                    .from('products')
                    .select('name, sku, quantity')
                    .eq('id', item.part_id)
                    .single()

                let takenByName = null
                if (item.taken_by) {
                    const { data: tkProfile } = await adminClient
                        .from('profiles')
                        .select('first_name, last_name')
                        .eq('id', item.taken_by)
                        .single()
                    if (tkProfile) {
                        takenByName = `${tkProfile.first_name} ${tkProfile.last_name}`
                    }
                }

                itemsWithProducts.push({
                    ...item,
                    products: product,
                    taken_by_name: takenByName
                })
            }
        }

        logsWithItems.push({
            ...log,
            day_log_items: itemsWithProducts,
            profiles: profileMap[log.created_by] || { first_name: 'Unknown', last_name: '', email: '' }
        })
    }

    return logsWithItems
}
