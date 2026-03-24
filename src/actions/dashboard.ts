'use server'

import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'

export async function getDashboardStats() {
    const supabase = await createServerSupabaseClient()

    // 1. Fetch products to calculate stock levels
    // Since Supabase doesn't support comparing two columns in a single filter (quantity < min_stock_level),
    // and this is a lab inventory with a manageable number of products, 
    // fetching and filtering locally is the most reliable approach currently.
    const { data: products, error: productError } = await supabase
        .from('products')
        .select('quantity, min_stock_level')
    
    if (productError) {
        console.error("Stats product fetch error:", productError)
    }

    const stats = {
        totalParts: products?.length || 0,
        lowStock: products?.filter(p => p.quantity > 0 && p.quantity <= p.min_stock_level).length || 0,
        outOfStock: products?.filter(p => p.quantity === 0).length || 0,
    }

    // 2. Recent Logs (Today)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const { count: recentLogsCount, error: logError } = await supabase
        .from('day_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())
        .eq('status', 'SUBMITTED')

    if (logError) {
        console.error("Stats log fetch error:", logError)
    }

    return {
        ...stats,
        recentLogs: recentLogsCount || 0
    }
}

export async function getInventory(page: number = 1, limit: number = 8, query?: string) {
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

    const products = data.map(item => {
        let status = 'In Stock'
        if (item.quantity === 0) status = 'Out of Stock'
        else if (item.quantity <= item.min_stock_level) status = 'Low Stock'
        
        return {
            ...item,
            status,
            qty: `${item.quantity} units` // Format as required by UI
        }
    })

    return { products, count: count || 0 }
}

export async function getRecentActivity(limit: number = 5) {
    const supabase = await createServerSupabaseClient()

    // 1. Fetch recent activity items
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

    if (error) {
        console.error("Activity fetch error:", error)
        return []
    }

    if (!items || items.length === 0) return []

    // 2. Fetch profiles for the users who created the logs
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
        
        // Map types to titles and descriptions as requested
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
}

export async function globalSearch(query: string) {
    if (!query) return []
    const supabase = await createServerSupabaseClient()

    // 1. Search Products
    const { data: products } = await supabase
        .from('products')
        .select('id, name, sku, category, quantity, status:quantity') // status will be mapped
        .or(`name.ilike.%${query}%,sku.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(5)

    // 2. Search Suppliers
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
}
