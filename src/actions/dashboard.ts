'use server'

import { 
    fetchDashboardStats, 
    fetchInventoryData, 
    fetchRecentActivityFeed, 
    searchGlobalInventory,
    checkTodayLogSubmission
} from '@/lib/dashboard'

export const getDashboardStats = fetchDashboardStats
export const getInventory = fetchInventoryData
export const getRecentActivity = fetchRecentActivityFeed
export const globalSearch = searchGlobalInventory
export const isTodayLogFilled = checkTodayLogSubmission
