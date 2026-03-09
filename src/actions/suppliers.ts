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
            category
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
            category
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

export async function getSuppliers(page: number = 1, limit: number = 100) {
    const supabase = await createServerSupabaseClient()
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabase
        .from('suppliers')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        console.error("Fetch error:", error);
        return { suppliers: [], count: 0, error: error.message };
    }

    return { suppliers: data || [], count: count || 0 };
}

