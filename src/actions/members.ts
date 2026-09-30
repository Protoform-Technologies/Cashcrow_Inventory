'use server'

import { revalidatePath } from 'next/cache'
import { 
    dbGetMembers, 
    dbAddMemberAuth, 
    dbUpdateMemberProfile, 
    dbUpdateMemberAuth, 
    dbDeleteMember,
    dbGetMemberById,
    dbForceLogOutMember,
    dbUpsertMemberProfile
} from '@/lib/members'
import { sendOnboardingEmail, sendReactivationEmail } from '@/lib/email'
import { getAdminProfileOrRedirect } from './auth'
import { createNotification } from './notifications'

export async function addMember(formData: FormData) {
    const admin = await getAdminProfileOrRedirect()
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const role = formData.get('role') as string

    if (!firstName || !lastName || !email || !role) {
        return { error: 'Please provide all required fields.' }
    }

    try {
        // 1. Create User in Supabase Auth
        const user = await dbAddMemberAuth(email, firstName, lastName, role)

        if (!user) {
            return { error: 'Failed to create member account.' }
        }

        // 2, 3 & 4. Update Profile, Send Email, and Create Notification concurrently
        await Promise.all([
            dbUpsertMemberProfile({
                id: user.id,
                first_name: firstName,
                last_name: lastName,
                email: email,
                role: role as any,
                is_active: false
            }),
            sendOnboardingEmail(email, firstName, lastName).catch(e => console.error("Email error:", e)),
            createNotification({
                title: 'New Member Added',
                message: `${firstName} ${lastName} has joined the team as ${role}.`,
                type: 'MEMBER_ADDED',
                link: '/admin/add-members',
                target_role: 'ADMIN',
                creator_id: admin.id
            }).catch(e => console.error("Notification error:", e))
        ])

        revalidatePath('/admin/add-members')
        return { success: `Successfully added ${firstName} ${lastName}! An onboarding email has been sent to ${email}.` }
    } catch (error: any) {
        console.error('Add member error:', error.message)
        return { error: error.message || 'An unexpected error occurred.' }
    }
}

export async function deactivateMember(id: string) {
    const admin = await getAdminProfileOrRedirect()
    if (admin.id === id) {
        return { error: "You cannot deactivate your own account." }
    }

    try {
        // 1. Update Profile status
        await dbUpdateMemberProfile(id, { is_active: false })
        
        // 2. Update Auth Metadata for instant check
        await dbUpdateMemberAuth(id, { is_active: false })

        // 3. Force Global Logout
        await dbForceLogOutMember(id)

        revalidatePath('/admin/add-members')
        return { success: true }
    } catch (error: any) {
        console.error('Deactivate member error:', error.message)
        return { error: error.message || 'Failed to deactivate member.' }
    }
}

export async function reactivateMember(id: string) {
    try {
        const member = await dbGetMemberById(id)
        await dbUpdateMemberProfile(id, { is_active: true })
        await dbUpdateMemberAuth(id, { is_active: true })
        
        // 3. Send Reactivation Email (Background)
        sendReactivationEmail(member.email, member.first_name, member.last_name).catch(console.error)

        revalidatePath('/admin/add-members')
        return { success: true }
    } catch (error: any) {
        console.error('Reactivate member error:', error.message)
        return { error: error.message || 'Failed to reactivate member.' }
    }
}

export async function deleteMemberPermanently(id: string) {
    const admin = await getAdminProfileOrRedirect()
    if (admin.id === id) {
        return { error: "You cannot delete your own account." }
    }

    try {
        await dbDeleteMember(id)
        revalidatePath('/admin/add-members')
        return { success: true }
    } catch (error: any) {
        console.error('Delete member error:', error.message)
        return { error: error.message || 'Failed to delete member.' }
    }
}

export async function updateMember(id: string, formData: FormData) {
    const admin = await getAdminProfileOrRedirect()
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const role = formData.get('role') as string
    const isActive = formData.get('isActive') === 'true'

    if (!firstName || !lastName || !role) {
        return { error: 'Please provide all required fields.' }
    }

    // Restriction: Cannot change own role
    if (admin.id === id && admin.role !== role) {
        return { error: "You cannot change your own role. Please ask another admin to do this." }
    }

    try {
        // 1. Fetch current profile to check for role change
        const currentProfile = await dbGetMemberById(id)
        const roleChanged = currentProfile.role !== role

        // 2. Update profile in database
        await dbUpdateMemberProfile(id, {
            first_name: firstName,
            last_name: lastName,
            role: role,
            is_active: isActive
        })

        // 3. Update user metadata in auth (sync both role and is_active)
        await dbUpdateMemberAuth(id, {
            first_name: firstName,
            last_name: lastName,
            role: role,
            is_active: isActive
        })

        // 4. Force Logout if role changed (requirement: immediate enforcement)
        if (roleChanged) {
            await dbForceLogOutMember(id)
        }

        revalidatePath('/admin/add-members')
        return { 
            success: true, 
            message: roleChanged ? 'Role updated and user signed out for security.' : undefined 
        }
    } catch (error: any) {
        console.error('Update member error:', error.message)
        return { error: error.message || 'An unexpected error occurred.' }
    }
}

export async function getMembers() {
    try {
        return await dbGetMembers()
    } catch (error) {
        console.error('Fetch members action error:', error)
        return []
    }
}
