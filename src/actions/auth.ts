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

    // 2. Fetch user profile and role using Admin Client to bypass RLS recursion
    const adminClient = getSupabaseAdmin()
    const { data: profile, error: profileError } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

    if (profileError) {
        console.error('Profile fetch error:', profileError.message)
        return { error: 'Could not fetch user profile. Please contact support.' }
    }

    // 3. Redirect based on role
    const role = profile.role?.toUpperCase()

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
    const redirectTo = `${origin}/auth/callback?next=/reset-password`

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

    const { error } = await supabase.auth.updateUser({
        password,
    })

    if (error) {
        console.error('Update password error:', error.message)
        return { error: error.message }
    }

    return { success: true }
}
