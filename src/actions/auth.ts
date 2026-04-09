'use server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Please enter both email and password.' }
    }

    const supabase = await createServerSupabaseClient()

    // 1. Sign in with Supabase Auth (SSR client handles cookies automatically)
    const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (authError) {
        console.error('Auth error:', authError.message)
        return { error: 'Invalid email or password.' }
    }

    const userId = data.user?.id
    if (!userId) {
        return { error: 'Authentication failed. Please try again.' }
    }

    // 2. Optimized Role Retrieval
    // Check if role is already in app_metadata (Cached)
    let role = data.user?.app_metadata?.role?.toUpperCase()
    let isActive = data.user?.app_metadata?.is_active

    if (!role) {
        // Fallback to fetching user profile and role using Admin Client
        const adminClient = getSupabaseAdmin()
        const { data: profile, error: profileError } = await adminClient
            .from('profiles')
            .select('role, is_active')
            .eq('id', userId)
            .single()

        if (profileError) {
            console.error('Profile fetch error:', profileError.message)
            return { error: 'Could not fetch user profile. Please contact support.' }
        }

        role = profile.role?.toUpperCase()
        isActive = profile.is_active

        // 3. Cache the role in app_metadata for future speed
        // This will make all future logins and middleware checks instant
        await adminClient.auth.admin.updateUserById(userId, {
            app_metadata: { role, is_active: isActive }
        })
    }

    // 4. Check if account is active or needs password setup
    if (isActive === false) {
        redirect('/reset-password')
    }

    // 5. Redirect based on role
    if (role === 'ADMIN') {
        redirect('/admin')
    } else if (role === 'MEMBER') {
        redirect('/member')
    } else {
        return { error: 'User role not recognized.' }
    }
}

export async function logout() {
    const supabase = await createServerSupabaseClient()
    await supabase.auth.signOut()
    redirect('/')
}

export async function sendResetPasswordEmail(email: string) {
    const supabase = await createServerSupabaseClient()

    // Construct the reset URL dynamically based on the environment
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const redirectTo = `${origin}/api/auth/callback?next=/reset-password`

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
    })

    if (error) {
        console.error('Reset password error:', error.message)
        return { error: error.message }
    }

    return { success: true }
}

export async function updatePassword(password: string) {
    const supabase = await createServerSupabaseClient()

    const { data: userData, error } = await supabase.auth.updateUser({
        password,
    })

    if (error) {
        console.error('Update password error:', error.message)
        return { error: error.message }
    }

    // Mark the profile as active
    const userId = userData.user?.id
    if (userId) {
        const adminClient = getSupabaseAdmin()
        await adminClient.from('profiles').update({ is_active: true }).eq('id', userId)
    }

    return { success: true }
}

export async function getAdminProfileOrRedirect() {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    const adminClient = getSupabaseAdmin()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role?.toUpperCase() !== 'ADMIN') {
        redirect('/')
    }

    return profile
}

export async function getMemberProfileOrRedirect() {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    const adminClient = getSupabaseAdmin()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role?.toUpperCase() !== 'MEMBER') {
        redirect('/admin')
    }

    return profile
}

export async function handleAuthCallback(code: string) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    return { error }
}
