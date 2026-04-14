import { DayLog, DayLogItem } from '../types/day-logs'

export async function getSubmittedLogsWithDetails() {
    // We import here to avoid circular dependencies
    const { getSupabaseAdmin } = await import('@/lib/supabase')
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
            .select('id, first_name, last_name, email, avatar_url')
            .in('id', logCreatorIds)

        if (profiles) {
            profiles.forEach((profile: any) => { profileMap[profile.id] = profile })
        }
    }

    // Now loop over the logs and fetch the items
    const logsWithItems: DayLog[] = []

    for (const log of submittedLogs) {
        const { data: items } = await adminClient
            .from('day_log_items')
            .select('*')
            .eq('day_log_id', log.id)

        const itemsWithProducts: DayLogItem[] = []
        if (items) {
            for (const item of items) {
                const { data: product } = await adminClient
                    .from('products')
                    .select('name, sku, quantity, image_url')
                    .eq('id', item.part_id)
                    .single()

                let takenByName = item.taken_by
                let takenByAvatarUrl = null

                if (item.taken_by && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.taken_by)) {
                    const { data: tkProfile } = await adminClient
                        .from('profiles')
                        .select('first_name, last_name, avatar_url')
                        .eq('id', item.taken_by)
                        .single()
                    if (tkProfile) {
                        takenByName = `${tkProfile.first_name} ${tkProfile.last_name}`
                        takenByAvatarUrl = tkProfile.avatar_url
                    }
                }

                itemsWithProducts.push({
                    ...item,
                    products: product,
                    taken_by_name: takenByName,
                    taken_by_avatar_url: takenByAvatarUrl
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

export async function deleteDayLogRecord(logId: string) {
    const { getSupabaseAdmin } = await import('@/lib/supabase')
    const supabase = getSupabaseAdmin()

    // Delete the log directly. The items should be deleted via CASCADE
    const { error: deleteLogError } = await supabase
        .from('day_logs')
        .delete()
        .eq('id', logId)

    if (deleteLogError) {
        throw new Error(deleteLogError.message)
    }

    return true
}

export async function getProductFullHistory(productId: string, page: number = 1, limit: number = 10) {
    const { getSupabaseAdmin } = await import('@/lib/supabase')
    const adminClient = getSupabaseAdmin()

    const from = (page - 1) * limit
    const to = from + limit - 1

    // 1. Fetch total count
    const { count, error: countError } = await adminClient
        .from('day_log_items')
        .select('*', { count: 'exact', head: true })
        .eq('part_id', productId)

    if (countError) {
        console.error('Error fetching history count:', countError)
        return { logs: [], total: 0 }
    }

    // 2. Fetch log items for the product
    const { data: items, error: itemsError } = await adminClient
        .from('day_log_items')
        .select(`
            *,
            day_logs (
                id,
                created_at,
                notes,
                created_by
            )
        `)
        .eq('part_id', productId)
        .order('created_at', { foreignTable: 'day_logs', ascending: false })
        .range(from, to)

    if (itemsError) {
        console.error('Error fetching history items:', itemsError)
        return { logs: [], total: 0 }
    }

    // 3. Process items and attach profiles
    const processedLogs = []
    
    // Get all unique profile IDs needed (creators and taken_bys)
    const profileIds = new Set<string>()
    items?.forEach((item: any) => {
        if (item.day_logs?.created_by) profileIds.add(item.day_logs.created_by)
        if (item.taken_by && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.taken_by)) {
            profileIds.add(item.taken_by)
        }
    })

    const profileMap: Record<string, any> = {}
    if (profileIds.size > 0) {
        const { data: profiles } = await adminClient
            .from('profiles')
            .select('id, first_name, last_name, avatar_url')
            .in('id', Array.from(profileIds))
        
        profiles?.forEach(p => { profileMap[p.id] = p })
    }

    for (const item of items || []) {
        const creator = profileMap[item.day_logs?.created_by]
        const taker = profileMap[item.taken_by]
        
        processedLogs.push({
            id: item.id,
            type: item.type,
            qty: item.qty,
            purpose: item.purpose,
            notes: item.notes || item.day_logs?.notes,
            created_at: item.day_logs?.created_at,
            author: creator ? `${creator.first_name} ${creator.last_name}` : 'System',
            author_avatar: creator?.avatar_url,
            taken_by_name: taker ? `${taker.first_name} ${taker.last_name}` : item.taken_by,
            taken_by_avatar_url: taker?.avatar_url
        })
    }

    return {
        logs: processedLogs,
        total: count || 0
    }
}
