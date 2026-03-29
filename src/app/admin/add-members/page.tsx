import { getAdminProfileOrRedirect } from '@/actions/auth'
import AddMembersClient from './add-members-client'
import { getMembers } from '@/actions/members'

export default async function AddMembersPage() {
    const profile = await getAdminProfileOrRedirect()
    const fullName = `${profile.first_name} ${profile.last_name}`

    // Fetch all members to display in the UI
    const members = await getMembers()

    return <AddMembersClient userName={fullName} members={members} />
}

