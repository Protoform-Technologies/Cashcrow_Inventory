import { cache } from 'react'
import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'

/**
 * Core dashboard data service
 */

export const fetchDashboardStats = cache(async () => {
    const supabase = await createServerSupabaseClient()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 1. Parallelize counts to maximize database throughput
    const [
        { count: totalParts },
        { count: outOfStock },
        { data: lowStockData },
        { count: recentLogsCount }
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('quantity', 0),
        // Column-to-column comparison still requires fetching columns, 
        // but we fetch ONLY what we need to minimize data transfer.
        supabase.from('products').select('quantity, min_stock_level'),
        supabase.from('day_logs').select('*', { count: 'exact', head: true })
            .gte('created_at', today.toISOString())
            .eq('status', 'SUBMITTED')
    ])

    // Calculate low stock in-memory (O(n) on 2 columns is very fast compared to fetching all data)
    const lowStock = (lowStockData || []).filter(
        p => p.quantity > 0 && p.quantity <= p.min_stock_level
    ).length

    return {
        totalParts: totalParts || 0,
        lowStock: lowStock || 0,
        outOfStock: outOfStock || 0,
        recentLogs: recentLogsCount || 0
    }
})

export const fetchInventoryData = cache(async (page: number = 1, limit: number = 8, query?: string) => {
    const supabase = await createServerSupabaseClient()
    const from = (page - 1) * limit
    const to = from + limit - 1

    let dbQuery = supabase
        .from('products')
        .select('*', { count: 'exact' })

    if (query) {
        dbQuery = dbQuery.or(`name.ilike.%${query}%,sku.ilike.%${query}%,category.ilike.%${query}%`)
    }

    const { data, count, error } = await dbQuery
        .order('created_at', { ascending: false })
        .range(from, to)

    if (error) {
        console.error("Fetch error:", error)
        return { products: [], count: 0 }
    }

    const products = (data || []).map(item => {
        let status = 'In Stock'
        if (item.quantity === 0) status = 'Out of Stock'
        else if (item.quantity <= item.min_stock_level) status = 'Low Stock'
        
        return {
            ...item,
            status,
            qty: `${item.quantity} units` 
        }
    })

    return { products, count: count || 0 }
})

export const fetchRecentActivityFeed = cache(async (limit: number = 5) => {
    const supabase = await createServerSupabaseClient()

    const { data: items, error } = await supabase
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
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error || !items) return []

    const userIds = Array.from(new Set(items.map(item => item.day_logs?.created_by).filter(Boolean)))
    
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

    return items.map(item => {
        const profile = item.day_logs?.created_by ? profileMap[item.day_logs.created_by] : null
        const userName = profile 
            ? `${profile.first_name} ${profile.last_name}`.trim()
            : 'Unknown User'
        
        let title = "Stock Updated"
        let description = `${userName} updated ${item.qty} units of ${item.products?.name}`
        let color = "bg-[#265136]"
        let type = item.type

        if (type === 'IN') {
            title = "Stock Adding"
            description = `${userName} added ${item.qty} units of ${item.products?.name}`
            color = "bg-emerald-600"
        } else if (type === 'ADJUST') {
            title = "Audit Checking"
            description = `${userName} adjusted ${item.products?.name} by ${item.qty} units`
            color = "bg-amber-500"
        } else if (type === 'OUT') {
            title = "Stock Updating"
            description = `${userName} removed ${item.qty} units of ${item.products?.name}`
            color = "bg-blue-600"
        } else if (type === 'RETURN') {
            title = "Stock Returned"
            description = `${userName} returned ${item.qty} units of ${item.products?.name}`
            color = "bg-purple-600"
        } else if (type === 'SCRAP') {
            title = "Stock Warning"
            description = `${userName} marked ${item.products?.name} as scrap (${item.qty} units)`
            color = "bg-rose-600"
        }

        return {
            title,
            description,
            time: new Date(item.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' • ' + (item.purpose || 'WAREHOUSE'),
            type: item.type,
            color
        }
    })
})

export const checkTodayLogSubmission = cache(async (userId: string) => {
    const supabase = await createServerSupabaseClient()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
        .from('day_logs')
        .select('id')
        .eq('created_by', userId)
        .gte('created_at', today.toISOString())
        .eq('status', 'SUBMITTED')
        .limit(1)

    return !!data && data.length > 0
})

export const searchGlobalInventory = cache(async (query: string) => {
    if (!query) return []
    const supabase = await createServerSupabaseClient()

    const { data: products } = await supabase
        .from('products')
        .select('id, name, sku, category, quantity') 
        .or(`name.ilike.%${query}%,sku.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(5)

    const { data: suppliers } = await supabase
        .from('suppliers')
        .select('id, company_name, contact_name, category')
        .or(`company_name.ilike.%${query}%,contact_name.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(5)

    const results = [
        ...(products || []).map(p => ({
            id: p.id,
            name: p.name,
            sub: `${p.sku} • ${p.category}`,
            info: `${p.quantity} units`,
            type: 'product' as const,
            status: p.quantity === 0 ? 'Out of Stock' : p.quantity <= 10 ? 'Low Stock' : 'In Stock'
        })),
        ...(suppliers || []).map(s => ({
            id: s.id,
            name: s.company_name,
            sub: `${s.contact_name || 'No contact'} • ${s.category}`,
            info: s.category,
            type: 'supplier' as const
        }))
    ]

    return results
})
