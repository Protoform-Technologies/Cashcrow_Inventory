import { getMemberProfileOrRedirect } from '@/actions/auth'
import DashboardLayout from '@/components/shared/dashboard/layout'
import StatsGrid from '@/components/shared/dashboard/stats-grid'
import InventoryTable from '@/components/shared/inventory/inventory-table'
import DailyLogFeed from '@/components/shared/dashboard/daily-log-feed'
import WelcomeBanner from '@/components/shared/dashboard/welcome-banner'
import { getDashboardStats, getInventory, getRecentActivity, isTodayLogFilled } from '@/actions/dashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Member Dashboard | Cashcrow Lab',
    description: 'Track inventory, record daily logs, and monitor laboratory stock levels from your personal member dashboard.',
}

export default async function MemberPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const profile = await getMemberProfileOrRedirect()

    // Fetch dynamic data
    const resolvedSearchParams = await searchParams as any
    const page = parseInt(resolvedSearchParams.page || '1', 10)
    
    // Concurrently fetch all dashboard data
    const [stats, inventoryData, recentLogs, logSubmitted] = await Promise.all([
        getDashboardStats(),
        getInventory(page, 5),
        getRecentActivity(4),
        isTodayLogFilled(profile.id)
    ])

    const fullName = `${profile.first_name} ${profile.last_name}`
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <DashboardLayout 
            userName={fullName} 
            userRole="Member" 
            userId={profile.id}
            avatarUrl={profile.avatar_url}
            title="Member Dashboard"
        >
            
            {/* Conditional Welcome Banner */}
            <WelcomeBanner 
                firstName={profile.first_name}
                today={today}
                role="MEMBER"
                logPath="/member/daily-log"
                isLogSubmitted={logSubmitted}
            />

            {/* Stats Grid */}
            <StatsGrid stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Inventory Table */}
                <div className="lg:col-span-2">
                    <InventoryTable
                        items={inventoryData.products}
                        totalCount={inventoryData.count}
                        currentPage={page}
                    />
                </div>

                {/* Daily Log Feed */}
                <div className="lg:col-span-1">
                    <DailyLogFeed logs={recentLogs} />
                </div>
            </div>
        </DashboardLayout>
    )
}
