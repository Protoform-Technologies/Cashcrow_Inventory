import { getAdminProfileOrRedirect } from '@/actions/auth'
import StatsGrid from '@/components/shared/dashboard/stats-grid'
import InventoryTable from '@/components/shared/inventory/inventory-table'
import DailyLogFeed from '@/components/shared/dashboard/daily-log-feed'
import WelcomeBanner from '@/components/shared/dashboard/welcome-banner'
import { fetchDashboardStats, fetchInventoryData, fetchRecentActivityFeed, checkTodayLogSubmission } from '@/lib/dashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Admin Dashboard | Cashcrow',
    description: 'Manage inventory, track stock levels, and monitor laboratory activities from the central admin command center.',
}

import { Suspense } from 'react'
import PageLoader from '@/components/shared/loaders/page-loader'

async function DashboardContent({ profile, page }: { profile: any, page: number }) {
    // Concurrently fetch all dashboard data bypassing Server Action overhead
    const [stats, inventoryData, recentLogs, logSubmitted] = await Promise.all([
        fetchDashboardStats(),
        fetchInventoryData(page, 5),
        fetchRecentActivityFeed(4),
        checkTodayLogSubmission(profile.id)
    ])

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
    })

    return (
        <>
            {/* Conditional Welcome Banner */}
            <WelcomeBanner
                firstName={profile.first_name}
                today={today}
                role="ADMIN"
                logPath="/admin/daily-log"
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
                        basePath="/admin/parts"
                        isDashboard={true}
                    />
                </div>

                {/* Daily Log Feed */}
                <div className="lg:col-span-1">
                    <DailyLogFeed logs={recentLogs} />
                </div>
            </div>
        </>
    )
}

export default async function AdminPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const profile = await getAdminProfileOrRedirect()

    // Fetch dynamic data
    const resolvedSearchParams = await searchParams as any
    const page = parseInt(resolvedSearchParams.page || '1', 10)

    return (
        <Suspense fallback={<PageLoader />}>
            <DashboardContent profile={profile} page={page} />
        </Suspense>
    )
}
