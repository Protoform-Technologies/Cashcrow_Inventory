'use server'

import { getSupabaseAdmin } from '@/lib/supabase'

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
        // Upsert because some setups might have a trigger that already created an empty profile on signUp.
        // If your database has an auth trigger, it might override this. Usually we use an ON CONFLICT update.
        // Just for safety if it fails, let's see.
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

    // Since we don't have Resend configured, we mock the email success and return it.
    // Setting up the actual automated email can be done via Supabase dashboard (invite users)
    // but here we forcefully create them so they can immediately login with Cashcrow@123.
    return { success: `Successfully added ${firstName} ${lastName}! Please notify them to login with Cashcrow@123.` }
}
