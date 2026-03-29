'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function addProduct(formData: FormData) {
    const supabase = await createServerSupabaseClient()

    // 1. Get file and upload to bucket if it exists
    const file = formData.get('photo') as File | null;
    let image_url = null;

    if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
            .from('products')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return { error: 'Failed to upload photo.' }
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);

        image_url = publicUrlData.publicUrl;
    }

    const name = formData.get('name') as string;
    const sku = formData.get('sku') as string;
    const category = formData.get('category') as string;
    const shelf_code = formData.get('shelf_code') as string;
    const box_code = formData.get('box_code') as string;
    const initial_quantity = parseInt(formData.get('initial_quantity') as string || '0', 10);
    const min_stock_level = parseInt(formData.get('min_stock_level') as string || '0', 10);
    const notes = formData.get('notes') as string;

    let vendors: any[] = [];
    try {
        const vendorsStr = formData.get('vendors') as string;
        if (vendorsStr) vendors = JSON.parse(vendorsStr);
    } catch (e) { /* ignore parse error */ }

    const { error: insertError } = await supabase
        .from('products')
        .insert({
            name,
            sku,
            category,
            shelf_code,
            box_code,
            quantity: initial_quantity,
            initial_quantity,
            min_stock_level,
            notes,
            image_url,
            vendors
        });

    if (insertError) {
        console.error("Insert error:", insertError);
        return { error: insertError.message || 'Failed to add product.' }
    }

    revalidatePath('/admin/parts')
    revalidatePath('/admin')

    return { success: true }
}

export async function updateProduct(id: string, formData: FormData) {
    const supabase = await createServerSupabaseClient()

    // 1. Get file and upload to bucket if it exists
    const file = formData.get('photo') as File | null;
    let image_url = formData.get('existing_image_url') as string | null;

    if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
            .from('products')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return { error: 'Failed to upload photo.' }
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);

        image_url = publicUrlData.publicUrl;
    }

    const name = formData.get('name') as string;
    const sku = formData.get('sku') as string;
    const category = formData.get('category') as string;
    const shelf_code = formData.get('shelf_code') as string;
    const box_code = formData.get('box_code') as string;
    const quantity = parseInt(formData.get('quantity') as string || '0', 10);
    const min_stock_level = parseInt(formData.get('min_stock_level') as string || '0', 10);
    const notes = formData.get('notes') as string;

    let vendors: any[] = [];
    try {
        const vendorsStr = formData.get('vendors') as string;
        if (vendorsStr) vendors = JSON.parse(vendorsStr);
    } catch (e) { /* ignore parse error */ }

    const { error: updateError } = await supabase
        .from('products')
        .update({
            name,
            sku,
            category,
            shelf_code,
            box_code,
            quantity,
            min_stock_level,
            notes,
            image_url,
            vendors
        })
        .eq('id', id);

    if (updateError) {
        console.error("Update error:", updateError);
        return { error: updateError.message || 'Failed to update product.' }
    }

    revalidatePath('/admin/parts')
    revalidatePath('/admin')

    return { success: true }
}

export async function deleteProduct(id: string) {
    const supabase = await createServerSupabaseClient()

    // Delete from products table
    const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (deleteError) {
        console.error("Delete error:", deleteError);
        return { error: 'Failed to delete product.' }
    }

    revalidatePath('/admin/parts')
    revalidatePath('/admin')

    return { success: true }
}

export async function getProducts(page: number = 1, limit: number = 6, query?: string) {
    const supabase = await createServerSupabaseClient()
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let dbQuery = supabase
        .from('products')
        .select('*', { count: 'exact' })

    if (query) {
        dbQuery = dbQuery.or(`name.ilike.%${query}%,sku.ilike.%${query}%,category.ilike.%${query}%`)
    }

    const { data, count, error } = await dbQuery
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        console.error("Fetch error:", error);
        return { products: [], count: 0, error: error.message };
    }

    return { products: data || [], count: count || 0 };
}

export async function searchProducts(query: string) {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error("Search error:", error);
        return [];
    }

    return data || [];
}

export async function getProductsForDropdown() {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from('products')
        .select('id, name, sku, category, quantity')
        .order('name', { ascending: true })

    if (error) {
        console.error('Error fetching products for dropdown:', error.message)
        return []
    }
    return data || []
}
