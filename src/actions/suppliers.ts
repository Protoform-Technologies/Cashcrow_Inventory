'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function addSupplier(formData: FormData) {
    const supabase = await createServerSupabaseClient()

    const company_name = formData.get('company_name') as string
    const website = formData.get('website') as string
    const contact_name = formData.get('contact_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const lead_time = parseInt(formData.get('lead_time') as string || '7', 10)
    const payment_terms = formData.get('payment_terms') as string
    const category = formData.get('category') as string
    const gst_no = formData.get('gst_no') as string
    const bank_account = formData.get('bank_account') as string
    const ifsc = formData.get('ifsc') as string
    const branch = formData.get('branch') as string

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
            branch: branch || null
        })

    if (insertError) {
        console.error("Insert error:", insertError)
        return { error: insertError.message || 'Failed to add supplier.' }
    }

    revalidatePath('/admin/add-suppliers')

    return { success: true }
}

export async function updateSupplier(id: string, formData: FormData) {
    const supabase = await createServerSupabaseClient()

    const company_name = formData.get('company_name') as string
    const website = formData.get('website') as string
    const contact_name = formData.get('contact_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const lead_time = parseInt(formData.get('lead_time') as string || '7', 10)
    const payment_terms = formData.get('payment_terms') as string
    const category = formData.get('category') as string
    const gst_no = formData.get('gst_no') as string
    const bank_account = formData.get('bank_account') as string
    const ifsc = formData.get('ifsc') as string
    const branch = formData.get('branch') as string

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
            branch: branch || null
        })
        .eq('id', id)

    if (updateError) {
        console.error("Update error:", updateError)
        return { error: updateError.message || 'Failed to update supplier.' }
    }

    revalidatePath('/admin/add-suppliers')

    return { success: true }
}

export async function deleteSupplier(id: string) {
    const supabase = await createServerSupabaseClient()

    const { error: deleteError } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id)

    if (deleteError) {
        console.error("Delete error:", deleteError)
        return { error: 'Failed to delete supplier.' }
    }

    revalidatePath('/admin/add-suppliers')

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

