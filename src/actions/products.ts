'use server'

import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { createNotification } from './notifications'
import {
    fetchInventoryData,
    fetchProductsForDropdown,
    createProduct,
    updateProductById,
    deleteProductById
} from '@/lib/inventory'

export async function addProduct(formData: FormData) {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    const adminClient = getSupabaseAdmin()

    const file = formData.get('photo') as File | null;
    const dataSheetFile = formData.get('data_sheet') as File | null;
    const name = formData.get('name') as string;
    const initial_quantity = parseInt(formData.get('initial_quantity') as string || '0', 10);

    let vendors: any[] = [];
    try {
        const vendorsStr = formData.get('vendors') as string;
        if (vendorsStr) vendors = JSON.parse(vendorsStr);
    } catch (e) { /* ignore parse error */ }

    // Parallelize uploads and auto-create suppliers
    const uploadPhotoTask = async () => {
        if (!file || file.size === 0) return null;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const { error } = await adminClient.storage.from('products').upload(fileName, file, { cacheControl: '3600', upsert: false });
        if (error) return null;
        const { data } = adminClient.storage.from('products').getPublicUrl(fileName);
        return data.publicUrl;
    };

    const uploadDsTask = async () => {
        if (!dataSheetFile || dataSheetFile.size === 0) return null;
        const fileExt = dataSheetFile.name.split('.').pop();
        const fileName = `ds_${Math.random().toString(36).substring(2, 10)}_${Date.now()}.${fileExt}`;
        const { error } = await adminClient.storage.from('data_sheets').upload(fileName, dataSheetFile, { cacheControl: '3600', upsert: false });
        if (error) return null;
        const { data } = adminClient.storage.from('data_sheets').getPublicUrl(fileName);
        return data.publicUrl;
    };


    const [image_url, data_sheet_url] = await Promise.all([
        uploadPhotoTask(),
        uploadDsTask()
    ]);

    // 2. Call LIB for pure DB insert
    const insertProductPromise = createProduct({
        name,
        sku: formData.get('sku') as string,
        category: formData.get('category') as string,
        shelf_code: formData.get('shelf_code') as string,
        box_code: formData.get('box_code') as string,
        quantity: initial_quantity,
        initial_quantity,
        min_stock_level: parseInt(formData.get('min_stock_level') as string || '0', 10),
        notes: formData.get('notes') as string,
        image_url,
        data_sheet_url,
        vendors
    });

    const notificationPromise = createNotification({
        title: 'New Product Added',
        message: `${name} has been added to the inventory.`,
        type: 'PRODUCT_ADDED',
        link: `/admin/parts?q=${encodeURIComponent(name)}`,
        target_role: 'ALL',
        creator_id: user?.id
    });

    const [{ error: insertError }] = await Promise.all([
        insertProductPromise,
        notificationPromise.catch(e => console.error("Notification trigger error:", e))
    ]);

    if (insertError) {
        console.error("Insert error:", insertError);
        return { error: insertError.message || 'Failed to add product.' }
    }

    // 3. Handle Side Effects (Logic stays in Action)
    revalidatePath('/admin/parts')
    revalidatePath('/admin')

    return { success: true }
}

export async function updateProduct(id: string, formData: FormData) {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    const adminClient = getSupabaseAdmin()

    const file = formData.get('photo') as File | null;
    let image_url = formData.get('existing_image_url') as string | null;
    const dataSheetFile = formData.get('data_sheet') as File | null;
    let data_sheet_url = formData.get('existing_data_sheet_url') as string | null;
    const name = formData.get('name') as string;

    const updateData: any = {};
    if (formData.has('vendors')) {
        try { updateData.vendors = JSON.parse(formData.get('vendors') as string); } catch (e) {}
    }

    const uploadPhotoTask = async () => {
        if (!file || file.size === 0) return image_url;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const { error } = await adminClient.storage.from('products').upload(fileName, file, { cacheControl: '3600', upsert: false });
        if (error) return image_url;
        const { data } = adminClient.storage.from('products').getPublicUrl(fileName);
        return data.publicUrl;
    };

    const uploadDsTask = async () => {
        if (!dataSheetFile || dataSheetFile.size === 0) return data_sheet_url;
        const fileExt = dataSheetFile.name.split('.').pop();
        const fileName = `ds_${Math.random().toString(36).substring(2, 10)}_${Date.now()}.${fileExt}`;
        const { error } = await adminClient.storage.from('data_sheets').upload(fileName, dataSheetFile, { cacheControl: '3600', upsert: false });
        if (error) return data_sheet_url;
        const { data } = adminClient.storage.from('data_sheets').getPublicUrl(fileName);
        return data.publicUrl;
    };

    const results = await Promise.all([uploadPhotoTask(), uploadDsTask()]);
    image_url = results[0];
    data_sheet_url = results[1];

    if (image_url) updateData.image_url = image_url;
    if (data_sheet_url) updateData.data_sheet_url = data_sheet_url;
    if (formData.has('name')) updateData.name = name;
    if (formData.has('sku')) updateData.sku = formData.get('sku') as string;
    if (formData.has('category')) updateData.category = formData.get('category') as string;
    if (formData.has('shelf_code')) updateData.shelf_code = formData.get('shelf_code') as string;
    if (formData.has('box_code')) updateData.box_code = formData.get('box_code') as string;
    if (formData.has('quantity')) updateData.quantity = parseInt(formData.get('quantity') as string || '0', 10);
    if (formData.has('min_stock_level')) updateData.min_stock_level = parseInt(formData.get('min_stock_level') as string || '0', 10);
    if (formData.has('notes')) updateData.notes = formData.get('notes') as string;

    const { error: updateError } = await updateProductById(id, updateData);

    if (updateError) {
        console.error("Update error:", updateError);
        return { error: updateError.message || 'Failed to update product.' }
    }

    // 3. Handle Side Effects (Stays in Action)
    revalidatePath('/admin/parts')
    revalidatePath(`/admin/parts/${id}`)
    revalidatePath('/admin')

    // 🔔 INVENTORY ALERTS (OUT OF STOCK & LOW STOCK)
    const { data: pData } = await supabase
        .from('products')
        .select('name, quantity, min_stock_level')
        .eq('id', id)
        .single()

    if (pData) {
        if (pData.quantity === 0) {
            createNotification({
                title: 'Item Out of Stock',
                message: `ALERT: ${pData.name} is now out of stock.`,
                type: 'OUT_OF_STOCK',
                link: `/admin/parts/${id}`,
                target_role: 'ADMIN',
                creator_id: user?.id
            }).catch(e => console.error("Out of stock notification error:", e));
        } else if (pData.quantity <= pData.min_stock_level) {
            createNotification({
                title: 'Low Stock Alert',
                message: `${pData.name} is at low stock (${pData.quantity} left).`,
                type: 'LOW_STOCK',
                link: `/admin/parts/${id}`,
                target_role: 'ADMIN',
                creator_id: user?.id
            }).catch(e => console.error("Low stock notification error:", e));
        }
    }

    return { success: true }
}

export async function deleteProduct(id: string) {
    // 1. Call LIB for pure DB delete
    const { error: deleteError } = await deleteProductById(id)

    if (deleteError) {
        console.error("Delete error:", deleteError);
        return { error: 'Failed to delete product.' }
    }

    // 2. Handle Side Effects (Stays in Action)
    revalidatePath('/admin/parts')
    revalidatePath('/admin')

    return { success: true }
}

export const getProducts = fetchInventoryData
export const getProductsForDropdown = fetchProductsForDropdown
