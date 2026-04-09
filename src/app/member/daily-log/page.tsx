 import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/shared/dashboard/layout'
import DailyLogClient from '@/app/admin/daily-log/daily-log-client'
import { getMemberProfileOrRedirect } from '@/actions/auth'
import { getProductsForDropdown } from '@/actions/products'
import { getMembers } from '@/actions/members'
import { getSubmittedLogsWithDetails } from '@/actions/day-logs'

export default async function DailyLogPage() {
    const profile = await getMemberProfileOrRedirect()
    const fullName = `${profile.first_name} ${profile.last_name}`

    // Fetch products for the dropdown
    const products = await getProductsForDropdown()

    // Fetch all members from profiles using admin client to bypass RLS
    const members = await getMembers()
    
    // Fallback if members fetch fails deeply or is empty
    const finalMembers = members.length > 0 ? members : [{ id: profile.id, first_name: profile.first_name || 'Member', last_name: profile.last_name || '' }]

    // Fetch all submitted day logs with items properly
    const logsWithItems = await getSubmittedLogsWithDetails()

    return (
        <DashboardLayout 
            userName={fullName} 
            userRole="Lab Member" 
            avatarUrl={profile.avatar_url}
            title="Daily Log Entry"
        >
            <DailyLogClient 
                userName={fullName}
                userId={profile.id}
                products={products}
                members={finalMembers}
                submittedLogs={logsWithItems}
            />
        </DashboardLayout>
    )
}

