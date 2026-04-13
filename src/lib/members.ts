import { getSupabaseAdmin } from './supabase'

export interface MemberProfile {
    id: string
    first_name: string
    last_name: string
    email: string
    role: string
    is_active: boolean
    avatar_url?: string
    member_id?: string
    research_area?: string
    location?: string
    push_notifications?: boolean
    weekly_reports?: boolean
}

/**
 * Fetch all member profiles ordered by name
 */
export async function dbGetMembers() {
    const adminClient = getSupabaseAdmin()
    const { data: members, error } = await adminClient
        .from('profiles')
        .select('*')
        .order('first_name', { ascending: true })

    if (error) {
        console.error('Failed to fetch members data:', error.message)
        return []
    }

    return (members || []) as MemberProfile[]
}

/**
 * Fetch a single member profile by ID
 */
export async function dbGetMemberById(id: string) {
    const adminClient = getSupabaseAdmin()
    const { data: member, error } = await adminClient
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        throw new Error(error.message)
    }

    return member as MemberProfile
}

/**
 * Create a new member in Supabase Auth
 */
export async function dbAddMemberAuth(email: string, firstName: string, lastName: string, role: string) {
    const adminClient = getSupabaseAdmin()
    
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
        throw new Error(authError.message)
    }

    return authData.user
}

/**
 * Upsert member profile in the database
 */
export async function dbUpsertMemberProfile(profile: Partial<MemberProfile> & { id: string }) {
    const adminClient = getSupabaseAdmin()
    
    const { error } = await adminClient
        .from('profiles')
        .upsert(profile)

    if (error) {
        throw new Error(error.message)
    }

    return true
}

/**
 * Update member profile
 */
export async function dbUpdateMemberProfile(id: string, updates: Partial<MemberProfile>) {
    const adminClient = getSupabaseAdmin()
    
    const { error } = await adminClient
        .from('profiles')
        .update(updates)
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    return true
}

/**
 * Update member auth metadata
 */
export async function dbUpdateMemberAuth(id: string, metadata: Record<string, any>) {
    const adminClient = getSupabaseAdmin()
    
    const { error } = await adminClient.auth.admin.updateUserById(id, {
        user_metadata: metadata
    })

    if (error) {
        throw new Error(error.message)
    }

    return true
}

/**
 * Delete member from both Auth and Profiles
 */
export async function dbDeleteMember(id: string) {
    const adminClient = getSupabaseAdmin()

    // 1. Delete from profiles table
    const { error: profileError } = await adminClient
        .from('profiles')
        .delete()
        .eq('id', id)

    if (profileError) {
        throw new Error(`Profile deletion failed: ${profileError.message}`)
    }

    // 2. Delete from auth users
    const { error: authError } = await adminClient.auth.admin.deleteUser(id)

    if (authError) {
        throw new Error(`Auth deletion failed: ${authError.message}`)
    }

    return true
}

/**
 * Force a user to log out globally (invalidates all sessions)
 */
export async function dbForceLogOutMember(id: string) {
    const adminClient = getSupabaseAdmin()
    
    // This invalidates all active sessions for the user
    // forcing them to re-authenticate on next interaction
    const { error } = await adminClient.auth.admin.signOut(id)

    if (error) {
        console.error('Sign out error:', error.message)
        // We log but don't strictly throw if signOut fails, 
        // as the profile was already updated.
    }

    return true
}
