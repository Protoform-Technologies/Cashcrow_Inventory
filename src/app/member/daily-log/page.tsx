import { redirect } from 'next/navigation'
import { Metadata } from 'next'

import DailyLogManager from '@/components/shared/day-logs/daily-log-manager'
import { getMemberProfileOrRedirect } from '@/actions/auth'
import { getProductsForDropdown } from '@/actions/products'
import { getMembers } from '@/actions/members'
import { getSubmittedLogsWithDetails } from '@/actions/day-logs'

export const metadata: Metadata = {
    title: 'Daily Log Entry | Cashcrow',
    description: 'Record laboratory product usage and returns to maintain precise inventory accountability.',
}

export default async function DailyLogPage() {
    const profile = await getMemberProfileOrRedirect()
    const fullName = `${profile.first_name} ${profile.last_name}`

    // Fetch all required data in parallel for optimal performance
    const [products, members, logsWithItems] = await Promise.all([
        getProductsForDropdown(),
        getMembers(),
        getSubmittedLogsWithDetails()
    ])

    const activeMembers = members.filter(m => m.is_active !== false)

    // Fallback if members fetch fails deeply or is empty
    const finalMembers = activeMembers.length > 0 ? activeMembers : [{
        id: profile.id,
        first_name: profile.first_name || 'Member',
        last_name: profile.last_name || '',
        role: profile.role || 'Member'
    }]

    return (
        <DailyLogManager
            userName={fullName}
            userId={profile.id}
            userRole={profile.role}
            products={products}
            members={finalMembers}
            submittedLogs={logsWithItems}
        />
    )
}

