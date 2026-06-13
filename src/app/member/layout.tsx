import { getMemberProfileOrRedirect } from '@/actions/auth'
import DashboardLayout from '@/components/shared/dashboard/layout'

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
    const profile = await getMemberProfileOrRedirect()
    const fullName = `${profile.first_name} ${profile.last_name}`

    return (
        <DashboardLayout 
            userName={fullName} 
            userRole={profile.role} 
            userId={profile.id}
            avatarUrl={profile.avatar_url}
        >
            {children}
        </DashboardLayout>
    )
}
