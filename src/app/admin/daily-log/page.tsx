import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import DailyLogClient from './daily-log-client'
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

    // Skip profile check - just use email as name
    const fullName = user.email?.split('@')[0] || 'Admin'

    // Fetch products for the dropdown
    const products = await getProductsForDropdown()

    // Fetch all members from profiles using admin client to bypass RLS
    const members = await getMembers()
    
    // Fallback if members fetch fails deeply or is empty
    const finalMembers = members.length > 0 ? members : [{ id: user.id, first_name: user.email?.split('@')[0] || 'User', last_name: '' }]

    // Fetch all submitted day logs with items properly
    const logsWithItems = await getSubmittedLogsWithDetails()

    return (
        <DailyLogClient 
            userName={fullName}
            userId={user.id}
            products={products}
            members={finalMembers}
            submittedLogs={logsWithItems}
        />
    )
}
