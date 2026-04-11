import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/shared/dashboard/layout'
import DailyLogClient from './daily-log-client'
import { getAdminProfileOrRedirect } from '@/actions/auth'
import { getProductsForDropdown } from '@/actions/products'
import { getMembers } from '@/actions/members'
import { getSubmittedLogsWithDetails } from '@/actions/day-logs'

export default async function DailyLogPage() {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
        console.error('Auth error:', authError)
    }

    if (!user) {
        console.log('No user found, redirecting to login')
        redirect('/')
    }

    const profile = await getAdminProfileOrRedirect()
    const fullName = `${profile.first_name} ${profile.last_name}`

    // Fetch products for the dropdown
    const products = await getProductsForDropdown()

    // Fetch all members from profiles using admin client to bypass RLS
    const members = await getMembers()
    
    // Fallback if members fetch fails deeply or is empty
    const finalMembers = members.length > 0 ? members : [{ id: profile.id, first_name: profile.first_name || 'User', last_name: profile.last_name || '' }]

    // Fetch all submitted day logs with items properly
    const logsWithItems = await getSubmittedLogsWithDetails()

    return (
        <DashboardLayout 
            userName={fullName} 
            userRole="Admin" 
            userId={profile.id}
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
