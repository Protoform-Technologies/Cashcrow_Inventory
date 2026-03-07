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

    let vendors = [];
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

export async function getProducts(page: number = 1, limit: number = 6) {
    const supabase = await createServerSupabaseClient()
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        console.error("Fetch error:", error);
        return { products: [], count: 0, error: error.message };
    }

    return { products: data || [], count: count || 0 };
}
