import { cache } from 'react'
import { createServerSupabaseClient } from '@/lib/supabase'

/**
 * Core inventory data service (READ)
 */

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
        console.error("Fetch inventory error:", error)
        return { products: [], count: 0 }
    }

    const products = (data || []).map(item => ({
        ...item,
        status: getProductStatus(item.quantity, item.min_stock_level),
        qtyFormatted: `${item.quantity || 0} units`
    }))

    return { products, count: count || 0 }
})

export const fetchProductById = cache(async (id: string) => {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error("Fetch product detail error:", error)
        return null
    }

    return {
        ...data,
        status: getProductStatus(data.quantity, data.min_stock_level)
    }
})

export const fetchProductsForDropdown = cache(async () => {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from('products')
        .select('id, name, sku, category, quantity, image_url')
        .order('name', { ascending: true })

    if (error) {
        console.error('Error fetching products for dropdown:', error.message)
        return []
    }
    return data || []
})

/**
 * Core inventory mutations (WRITE)
 * These do NOT include revalidation or notifications - that belongs in Actions.
 */

export async function createProduct(data: any) {
    const supabase = await createServerSupabaseClient()
    return await supabase.from('products').insert(data)
}

export async function updateProductById(id: string, data: any) {
    const supabase = await createServerSupabaseClient()
    return await supabase.from('products').update(data).eq('id', id)
}

export async function deleteProductById(id: string) {
    const supabase = await createServerSupabaseClient()
    return await supabase.from('products').delete().eq('id', id)
}

// Helper for status consistency
function getProductStatus(quantity: number, minLevel: number) {
    if (quantity === 0) return 'Out of Stock'
    if (quantity <= minLevel) return 'Low Stock'
    return 'In Stock'
}
