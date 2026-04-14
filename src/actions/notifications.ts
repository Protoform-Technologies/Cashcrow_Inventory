'use server'

import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export type NotificationType = 'PRODUCT_ADDED' | 'SUPPLIER_ADDED' | 'OUT_OF_STOCK'
export type TargetRole = 'ADMIN' | 'MEMBER' | 'ALL'

export interface CreateNotificationParams {
    title: string
    message: string
    type: NotificationType
    link: string
    target_role: TargetRole
    user_id?: string
}

export async function createNotification(params: CreateNotificationParams) {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
        .from('notifications')
        .insert({
            title: params.title,
            message: params.message,
            type: params.type,
            link: params.link,
            target_role: params.target_role,
            user_id: params.user_id || null,
            is_read: false
        })

    if (error) {
        console.error('Error creating notification:', error.message)
        return { error: error.message }
    }

    revalidatePath('/') // Revalidate everything to be safe for notifications
    return { success: true }
}

export async function getNotifications(userRole: string, userId: string) {
    const supabase = await createServerSupabaseClient()
    const role = userRole.toUpperCase()

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .or(`target_role.eq.ALL,target_role.eq.${role},user_id.eq.${userId}`)
        .order('created_at', { ascending: false })
        .limit(20)

    if (error) {
        console.error('Error fetching notifications:', error.message)
        return []
    }

    return data || []
}

export async function markNotificationAsRead(id: string) {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)

    if (error) {
        console.error('Error marking notification as read:', error.message)
        return { error: error.message }
    }

    revalidatePath('/')
    return { success: true }
}

export async function markAllAsRead(userRole: string, userId: string) {
    const supabase = getSupabaseAdmin()
    const role = userRole.toUpperCase()

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .or(`target_role.eq.ALL,target_role.eq.${role},user_id.eq.${userId}`)
        .eq('is_read', false)

    if (error) {
        console.error('Error marking all notifications as read:', error.message)
        return { error: error.message }
    }

    revalidatePath('/')
    return { success: true }
}

export async function deleteNotification(id: string) {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting notification:', error.message)
        return { error: error.message }
    }

    revalidatePath('/')
    return { success: true }
}
