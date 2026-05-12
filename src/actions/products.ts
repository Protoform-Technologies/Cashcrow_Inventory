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

    // 1. Get file and upload to bucket if it exists (Logic stays in Action)
    const file = formData.get('photo') as File | null;
    let image_url = null;

    if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await adminClient.storage
            .from('products')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (!uploadError) {
            const { data: publicUrlData } = adminClient.storage
                .from('products')
                .getPublicUrl(filePath);
            image_url = publicUrlData.publicUrl;
        }
    }

    // --- DATA SHEET UPLOAD ---
    const dataSheetFile = formData.get('data_sheet') as File | null;
    let data_sheet_url = null;

    if (dataSheetFile && dataSheetFile.size > 0) {
        const fileExt = dataSheetFile.name.split('.').pop();
        const fileName = `ds_${Math.random().toString(36).substring(2, 10)}_${Date.now()}.${fileExt}`;

        const { error: dsError } = await adminClient.storage
            .from('data_sheets')
            .upload(fileName, dataSheetFile, {
                cacheControl: '3600',
                upsert: false
            });

        if (!dsError) {
            const { data: dsUrlData } = adminClient.storage
                .from('data_sheets')
                .getPublicUrl(fileName);
            data_sheet_url = dsUrlData.publicUrl;
        }
    }

    const name = formData.get('name') as string;
    const initial_quantity = parseInt(formData.get('initial_quantity') as string || '0', 10);

    let vendors: any[] = [];
    try {
        const vendorsStr = formData.get('vendors') as string;
        if (vendorsStr) vendors = JSON.parse(vendorsStr);
    } catch (e) { /* ignore parse error */ }

    // --- AUTO-CREATE SUPPLIERS ---
    if (vendors.length > 0) {
        const vendorNames = vendors.map(v => v.name);
        const { data: existingSuppliers } = await supabase
            .from('suppliers')
            .select('company_name')
            .in('company_name', vendorNames);
            
        const existingNames = new Set(existingSuppliers?.map(s => s.company_name) || []);
        const newSuppliers = vendors
            .filter(v => !existingNames.has(v.name))
            .map(v => ({ 
                company_name: v.name,
                payment_terms: 'Prepaid',
                category: 'GENERAL'
            }));

        if (newSuppliers.length > 0) {
            const uniqueNewSuppliers = Array.from(new Map(newSuppliers.map(item => [item.company_name, item])).values());
            await adminClient.from('suppliers').insert(uniqueNewSuppliers);
        }
    }

    // 2. Call LIB for pure DB insert
    const { error: insertError } = await createProduct({
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

    if (insertError) {
        console.error("Insert error:", insertError);
        return { error: insertError.message || 'Failed to add product.' }
    }

    // 3. Handle Side Effects (Logic stays in Action)
    revalidatePath('/admin/parts')
    revalidatePath('/admin')

    try {
        await createNotification({
            title: 'New Product Added',
            message: `${name} has been added to the inventory.`,
            type: 'PRODUCT_ADDED',
            link: `/admin/parts?q=${encodeURIComponent(name)}`,
            target_role: 'ALL',
            creator_id: user?.id
        });
    } catch (e) {
        console.error("Notification trigger error:", e);
    }

    return { success: true }
}

export async function updateProduct(id: string, formData: FormData) {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    const adminClient = getSupabaseAdmin()

    // 1. Storage logic (Stays in Action)
    const file = formData.get('photo') as File | null;
    let image_url = formData.get('existing_image_url') as string | null;

    if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await adminClient.storage
            .from('products')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return { error: 'Failed to upload photo.' }
        }

        const { data: publicUrlData } = adminClient.storage
            .from('products')
            .getPublicUrl(filePath);

        image_url = publicUrlData.publicUrl;
    }

    // --- DATA SHEET UPLOAD ---
    const dataSheetFile = formData.get('data_sheet') as File | null;
    let data_sheet_url = formData.get('existing_data_sheet_url') as string | null;

    if (dataSheetFile && dataSheetFile.size > 0) {
        const fileExt = dataSheetFile.name.split('.').pop();
        const fileName = `ds_${Math.random().toString(36).substring(2, 10)}_${Date.now()}.${fileExt}`;

        const { error: dsError } = await adminClient.storage
            .from('data_sheets')
            .upload(fileName, dataSheetFile, {
                cacheControl: '3600',
                upsert: false
            });

        if (!dsError) {
            const { data: dsUrlData } = adminClient.storage
                .from('data_sheets')
                .getPublicUrl(fileName);
            data_sheet_url = dsUrlData.publicUrl;
        } else {
            console.error("Data sheet upload error:", dsError);
        }
    }

    const name = formData.get('name') as string;

    // 2. Build the update object dynamically for partial updates
    const updateData: any = {};

    // Only update image_url if a new one was uploaded or explicitly provided
    if (file && file.size > 0) {
        updateData.image_url = image_url;
    } else if (formData.has('existing_image_url')) {
        updateData.image_url = image_url;
    }

    // Only update data_sheet_url if a new one was uploaded or explicitly provided
    if (dataSheetFile && dataSheetFile.size > 0) {
        if (data_sheet_url) updateData.data_sheet_url = data_sheet_url;
    } else if (formData.has('existing_data_sheet_url')) {
        updateData.data_sheet_url = data_sheet_url;
    }

    if (formData.has('name')) updateData.name = name;
    if (formData.has('sku')) updateData.sku = formData.get('sku') as string;
    if (formData.has('category')) updateData.category = formData.get('category') as string;
    if (formData.has('shelf_code')) updateData.shelf_code = formData.get('shelf_code') as string;
    if (formData.has('box_code')) updateData.box_code = formData.get('box_code') as string;
    if (formData.has('quantity')) updateData.quantity = parseInt(formData.get('quantity') as string || '0', 10);
    if (formData.has('min_stock_level')) updateData.min_stock_level = parseInt(formData.get('min_stock_level') as string || '0', 10);
    if (formData.has('notes')) updateData.notes = formData.get('notes') as string;
    if (formData.has('vendors')) {
        try {
            updateData.vendors = JSON.parse(formData.get('vendors') as string);
        } catch (e) { /* ignore parse error */ }
    }

    // --- AUTO-CREATE SUPPLIERS ---
    if (updateData.vendors && updateData.vendors.length > 0) {
        const vendorNames = updateData.vendors.map((v: any) => v.name);
        const { data: existingSuppliers } = await supabase
            .from('suppliers')
            .select('company_name')
            .in('company_name', vendorNames);
            
        const existingNames = new Set(existingSuppliers?.map(s => s.company_name) || []);
        const newSuppliers = updateData.vendors
            .filter((v: any) => !existingNames.has(v.name))
            .map((v: any) => ({ 
                company_name: v.name,
                payment_terms: 'Prepaid',
                category: 'GENERAL'
            }));

        if (newSuppliers.length > 0) {
            const uniqueNewSuppliers = Array.from(new Map(newSuppliers.map((item: any) => [item.company_name, item])).values());
            await adminClient.from('suppliers').insert(uniqueNewSuppliers);
        }
    }

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
            try {
                await createNotification({
                    title: 'Item Out of Stock',
                    message: `ALERT: ${pData.name} is now out of stock.`,
                    type: 'OUT_OF_STOCK',
                    link: `/admin/parts/${id}`,
                    target_role: 'ADMIN',
                    creator_id: user?.id
                });
            } catch (e) {
                console.error("Out of stock notification error:", e);
            }
        } else if (pData.quantity <= pData.min_stock_level) {
            try {
                await createNotification({
                    title: 'Low Stock Alert',
                    message: `${pData.name} is at low stock (${pData.quantity} left).`,
                    type: 'LOW_STOCK',
                    link: `/admin/parts/${id}`,
                    target_role: 'ADMIN',
                    creator_id: user?.id
                });
            } catch (e) {
                console.error("Low stock notification error:", e);
            }
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
