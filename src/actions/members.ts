'use server'

import { revalidatePath } from 'next/cache'
import { 
    dbGetMembers, 
    dbAddMemberAuth, 
    dbUpsertMemberProfile, 
    dbUpdateMemberProfile, 
    dbUpdateMemberAuth, 
    dbDeleteMember,
    dbGetMemberById,
    dbForceLogOutMember
} from '@/lib/members'
import { sendOnboardingEmail } from '@/lib/email'

export async function addMember(formData: FormData) {
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

        // 2. Insert into Profiles table with is_active = false
        await dbUpsertMemberProfile({
            id: user.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            role: role,
            is_active: false
        })

        // 3. Send Onboarding Email
        await sendOnboardingEmail(email, firstName, lastName)

        revalidatePath('/admin/add-members')
        return { success: `Successfully added ${firstName} ${lastName}! An onboarding email has been sent to ${email}.` }
    } catch (error: any) {
        console.error('Add member error:', error.message)
        return { error: error.message || 'An unexpected error occurred.' }
    }
}

export async function deleteMember(id: string) {
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
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const role = formData.get('role') as string
    const isActive = formData.get('isActive') === 'true'

    if (!firstName || !lastName || !role) {
        return { error: 'Please provide all required fields.' }
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

        // 3. Update user metadata in auth
        await dbUpdateMemberAuth(id, {
            first_name: firstName,
            last_name: lastName,
            role: role
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
