 import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/layout'
import DailyLogClient from '@/app/admin/daily-log/daily-log-client'
import { getProductsForDropdown } from '@/actions/products'
import { getMembers } from '@/actions/members'
import { getSubmittedLogsWithDetails } from '@/actions/day-logs'

export default async function DailyLogPage() {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
        console.error('Auth error:', authError)
        redirect('/')
    }

    if (!user) {
        console.log('No user found, redirecting to login')
        redirect('/')
    }

    // Get profile for name (skip for compatibility)
    const fullName = user.email?.split('@')[0]?.replace('.', ' ') || user.email || 'Member'

    // Fetch products for the dropdown
    const products = await getProductsForDropdown()

    // Fetch all members from profiles using admin client to bypass RLS
    const members = await getMembers()
    
    // Fallback if members fetch fails deeply or is empty
    const finalMembers = members.length > 0 ? members : [{ id: user.id, first_name: fullName.split(' ')[0], last_name: fullName.split(' ').slice(1).join(' ') || '' }]

    // Fetch all submitted day logs with items properly
    const logsWithItems = await getSubmittedLogsWithDetails()

    return (
        <DashboardLayout userName={fullName} userRole="Lab Member" title="Daily Log Entry">
            <DailyLogClient 
                userName={fullName}
                userId={user.id}
                products={products}
                members={finalMembers}
                submittedLogs={logsWithItems}
            />
        </DashboardLayout>
    )
}

