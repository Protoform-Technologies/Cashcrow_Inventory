'use server'

import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { createNotification } from './notifications'

function toTitleCase(str: string) {
    if (!str) return ''
    return str.split(/[\s_]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
}

export async function addSupplier(formData: FormData) {
    const supabase = getSupabaseAdmin()

    const company_name = formData.get('company_name') as string
    const website = formData.get('website') as string
    const contact_name = formData.get('contact_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const lead_time = parseInt(formData.get('lead_time') as string || '7', 10)
    const payment_terms = formData.get('payment_terms') as string
    const category = toTitleCase((formData.get('category') as string || '').trim())
    const gst_no = formData.get('gst_no') as string
    const bank_account = formData.get('bank_account') as string
    const ifsc = formData.get('ifsc') as string
    const branch = formData.get('branch') as string
    const payment_id = formData.get('payment_id') as string

    const { error: insertError } = await supabase
        .from('suppliers')
        .insert({
            company_name,
            website: website || null,
            contact_name: contact_name || null,
            email: email || null,
            phone: phone || null,
            lead_time,
            payment_terms,
            category,
            gst_no: gst_no || null,
            bank_account: bank_account || null,
            ifsc: ifsc || null,
            branch: branch || null,
            payment_id: payment_id || null
        })
    if (insertError) {
        console.error("Insert error:", insertError)
        return { error: insertError.message || 'Failed to add supplier.' }
    }
    
    revalidatePath('/admin/suppliers')

    // 🔔 CREATE NOTIFICATION
    try {
        await createNotification({
            title: 'New Supplier Added',
            message: `${company_name} has been added to our supplier list.`,
            type: 'SUPPLIER_ADDED',
            link: `/admin/suppliers?q=${encodeURIComponent(company_name)}`,
            target_role: 'ADMIN' // Only admins receive this as requested
        });
    } catch (e) {
        console.error("Notification trigger error:", e);
    }

    return { success: true }
}

export async function updateSupplier(id: string, formData: FormData) {
    const supabase = getSupabaseAdmin()

    const company_name = formData.get('company_name') as string
    const website = formData.get('website') as string
    const contact_name = formData.get('contact_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const lead_time = parseInt(formData.get('lead_time') as string || '7', 10)
    const payment_terms = formData.get('payment_terms') as string
    const category = toTitleCase((formData.get('category') as string || '').trim())
    const gst_no = formData.get('gst_no') as string
    const bank_account = formData.get('bank_account') as string
    const ifsc = formData.get('ifsc') as string
    const branch = formData.get('branch') as string
    const payment_id = formData.get('payment_id') as string

    const { error: updateError } = await supabase
        .from('suppliers')
        .update({
            company_name,
            website: website || null,
            contact_name: contact_name || null,
            email: email || null,
            phone: phone || null,
            lead_time,
            payment_terms,
            category,
            gst_no: gst_no || null,
            bank_account: bank_account || null,
            ifsc: ifsc || null,
            branch: branch || null,
            payment_id: payment_id || null
        })
        .eq('id', id)

    if (updateError) {
        console.error("Update error:", updateError)
        return { error: updateError.message || 'Failed to update supplier.' }
    }

    revalidatePath('/admin/suppliers')

    return { success: true }
}

export async function deleteSupplier(id: string) {
    const supabase = getSupabaseAdmin()

    const { error: deleteError } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id)

    if (deleteError) {
        console.error("Delete error:", deleteError)
        return { error: 'Failed to delete supplier.' }
    }

    revalidatePath('/admin/suppliers')

    return { success: true }
}

export async function getSuppliers(page: number = 1, limit: number = 100, query?: string) {
    const supabase = await createServerSupabaseClient()
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let dbQuery = supabase
        .from('suppliers')
        .select('*', { count: 'exact' })

    if (query) {
        dbQuery = dbQuery.or(`company_name.ilike.%${query}%,contact_name.ilike.%${query}%,category.ilike.%${query}%`)
    }

    const { data, count, error } = await dbQuery
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        console.error("Fetch error:", error);
        return { suppliers: [], count: 0, error: error.message };
    }

    return { suppliers: data || [], count: count || 0 };
}

export async function getUniqueCategories() {
    const supabase = await createServerSupabaseClient()
    
    // Fetch unique categories using select
    const { data, error } = await supabase
        .from('suppliers')
        .select('category')
        .order('category', { ascending: true })

    if (error) {
        console.error("Fetch categories error:", error)
        return []
    }

    // Filter for uniqueness and normalize to Title Case in memory
    const categories = Array.from(
        new Set(
            data.map(item => toTitleCase((item.category || '').trim()))
        )
    ).filter(Boolean).sort()
    
    return categories
}

export async function getOrCreateSupplierByName(name: string) {
    const supabase = getSupabaseAdmin()

    // 1. Check if exists
    const { data: existing } = await supabase
        .from('suppliers')
        .select('id')
        .ilike('company_name', name)
        .single()

    if (existing) return existing.id

    // 2. Create minimal record
    const { data: created, error } = await supabase
        .from('suppliers')
        .insert({ company_name: name })
        .select('id')
        .single()

    if (error) {
        console.error("Error creating guest supplier:", error)
        throw new Error("Failed to resolve supplier")
    }

    return created.id
}
