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
        .not('email', 'like', 'DELETED_%')
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
        app_metadata: {
            first_name: firstName,
            last_name: lastName,
            role: role,
            is_active: false
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
        app_metadata: metadata
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

    // 1. Get the member's current email
    const { data: memberProfile } = await adminClient.from('profiles').select('email').eq('id', id).single()
    const deletedEmail = `DELETED_${id}_${memberProfile?.email || 'unknown'}`

    // 2. Soft delete: update profile email and is_active to false
    const { error: profileError } = await adminClient
        .from('profiles')
        .update({ email: deletedEmail, is_active: false })
        .eq('id', id)

    if (profileError) {
        throw new Error(`Profile soft deletion failed: ${profileError.message}`)
    }

    // 3. Also update auth metadata and email
    const { error: authError } = await adminClient.auth.admin.updateUserById(id, {
        email: deletedEmail,
        app_metadata: { is_active: false }
    })

    if (authError) {
        throw new Error(`Auth metadata soft deletion failed: ${authError.message}`)
    }

    // 4. Sign them out immediately
    await adminClient.auth.admin.signOut(id)

    return true
}

/**
 * Force a user to log out globally
 * Uses app_metadata to signal to middleware that the user's session is revoked.
 */
export async function dbForceLogOutMember(id: string) {
    const adminClient = getSupabaseAdmin()
    
    // Fetch user to get existing app_metadata
    const { data: user, error: fetchError } = await adminClient.auth.admin.getUserById(id)
    if (fetchError || !user.user) {
        console.error('Fetch user error:', fetchError?.message)
        return false
    }

    // Set force_logout flag
    const { error } = await adminClient.auth.admin.updateUserById(id, {
        app_metadata: { ...user.user.app_metadata, force_logout: true }
    })

    if (error) {
        console.error('Force logout error:', error.message)
    }

    return true
}
