'use server'

import { getSupabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function addMember(formData: FormData) {
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const role = formData.get('role') as string

    if (!firstName || !lastName || !email || !role) {
        return { error: 'Please provide all required fields.' }
    }

    const adminClient = getSupabaseAdmin()

    // 1. Create User in Supabase Auth
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email: email,
        password: 'Cashcrow@123',
        email_confirm: true,
        user_metadata: {
            first_name: firstName,
            last_name: lastName,
            role: role
        }
    })

    if (authError) {
        console.error('Create member auth error:', authError.message)
        return { error: authError.message }
    }

    const userId = authData.user?.id

    if (!userId) {
        return { error: 'Failed to create member account.' }
    }

    // 2. Insert into Profiles table with is_active = false
    const { error: profileError } = await adminClient
        .from('profiles')
        .upsert({
            id: userId,
            first_name: firstName,
            last_name: lastName,
            email: email,
            role: role,
            is_active: false
        })

    if (profileError) {
        console.error('Create member profile error:', profileError.message)
        return { error: 'Failed to create member profile. Note: Ensure "is_active" (boolean) exists in the profiles table.' }
    }

    revalidatePath('/admin/add-members')

    return { success: `Successfully added ${firstName} ${lastName}! Please notify them to login with Cashcrow@123.` }
}

export async function deleteMember(id: string) {
    const adminClient = getSupabaseAdmin()

    // Delete from profiles table first
    const { error: profileError } = await adminClient
        .from('profiles')
        .delete()
        .eq('id', id)

    if (profileError) {
        console.error('Delete member profile error:', profileError.message)
        return { error: 'Failed to delete member profile.' }
    }

    // Delete from auth users
    const { error: authError } = await adminClient.auth.admin.deleteUser(id)

    if (authError) {
        console.error('Delete member auth error:', authError.message)
        // Profile was already deleted, but auth failed - we should still revalidate
        revalidatePath('/admin/add-members')
        return { error: 'Failed to delete member authentication.' }
    }

    revalidatePath('/admin/add-members')

    return { success: true }
}

export async function updateMember(id: string, formData: FormData) {
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const role = formData.get('role') as string
    const isActive = formData.get('isActive') === 'true'

    if (!firstName || !lastName || !role) {
        return { error: 'Please provide all required fields.' }
    }

    const adminClient = getSupabaseAdmin()

    // Update profile
    const { error: profileError } = await adminClient
        .from('profiles')
        .update({
            first_name: firstName,
            last_name: lastName,
            role: role,
            is_active: isActive
        })
        .eq('id', id)

    if (profileError) {
        console.error('Update member profile error:', profileError.message)
        return { error: 'Failed to update member profile.' }
    }

    // Update user metadata in auth
    const { error: authError } = await adminClient.auth.admin.updateUserById(id, {
        user_metadata: {
            first_name: firstName,
            last_name: lastName,
            role: role
        }
    })

    if (authError) {
        console.error('Update member auth error:', authError.message)
        // Profile was updated, but auth metadata failed - we should still revalidate
        revalidatePath('/admin/add-members')
        return { error: 'Failed to update member authentication metadata.' }
    }

    revalidatePath('/admin/add-members')

    return { success: true }
}
