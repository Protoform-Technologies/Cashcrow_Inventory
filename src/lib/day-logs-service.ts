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
