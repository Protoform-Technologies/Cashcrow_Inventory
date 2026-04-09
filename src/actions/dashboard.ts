'use server'

import { 
    fetchDashboardStats, 
    fetchInventoryData, 
    fetchRecentActivityFeed, 
    searchGlobalInventory,
    checkTodayLogSubmission
} from '@/lib/dashboard'

export async function getDashboardStats() {
    return await fetchDashboardStats()
}

export async function getInventory(page: number = 1, limit: number = 8, query?: string) {
    return await fetchInventoryData(page, limit, query)
}

export async function getRecentActivity(limit: number = 5) {
    return await fetchRecentActivityFeed(limit)
}

export async function globalSearch(query: string) {
    return await searchGlobalInventory(query)
}

export async function isTodayLogFilled(userId: string) {
    return await checkTodayLogSubmission(userId)
}
