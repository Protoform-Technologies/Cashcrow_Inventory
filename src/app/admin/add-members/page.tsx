import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import AddMembersClient from './add-members-client'

export default async function AddMembersPage() {
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

    const fullName = `${profile.first_name} ${profile.last_name}`

    // Fetch all members to display in the UI
    const { data: members, error: membersError } = await adminClient
        .from('profiles')
        .select('id, first_name, last_name, email, role, is_active')
        .order('first_name', { ascending: true })

    if (membersError) {
        console.error('Failed to fetch members data:', membersError.message)
    }

    return <AddMembersClient userName={fullName} members={members || []} />
}

