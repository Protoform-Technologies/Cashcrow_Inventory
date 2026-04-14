'use server'

import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function getProfile() {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const adminClient = getSupabaseAdmin()
    const { data: profile, error } = await adminClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        console.error('Error fetching profile:', error.message)
        return null
    }

    return profile
}

export async function updateProfile(formData: FormData) {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const phoneNumber = formData.get('phone') as string

    const adminClient = getSupabaseAdmin()
    const { error } = await adminClient
        .from('profiles')
        .update({
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
        })
        .eq('id', user.id)

    if (error) {
        console.error('Error updating profile:', error.message)
        return { error: 'Failed to update profile details' }
    }

    revalidatePath('/admin/profile')
    revalidatePath('/member/profile')
    return { success: true }
}

export async function uploadAvatar(formData: FormData) {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const file = formData.get('avatar') as File
    if (!file) return { error: 'No file provided' }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const adminClient = getSupabaseAdmin()

    // 1. Upload to Supabase Storage using Admin Client to bypass RLS
    const { data: uploadData, error: uploadError } = await adminClient.storage
        .from('profile')
        .upload(filePath, file, {
            upsert: true,
            contentType: file.type
        })

    if (uploadError) {
        console.error('SERVER: Update avatar upload error:', uploadError)
        return { error: `Upload failed: ${uploadError.message}` }
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = adminClient.storage
        .from('profile')
        .getPublicUrl(filePath)

    // 3. Update Profiles table
    const { error: updateError } = await adminClient
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

    if (updateError) {
        console.error('Update profile avatar error:', updateError.message)
        return { error: 'Failed to update profile avatar' }
    }

    revalidatePath('/admin/profile')
    revalidatePath('/member/profile')
    return { success: true, url: publicUrl }
}

export async function removeAvatar() {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const adminClient = getSupabaseAdmin()
    const { error } = await adminClient
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id)

    if (error) {
        console.error('Error removing avatar:', error.message)
        return { error: 'Failed to remove avatar' }
    }

    revalidatePath('/admin/profile')
    revalidatePath('/member/profile')
    return { success: true }
}
