import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/layout'
import StatsGrid from '@/components/dashboard/stats-grid'
import InventoryTable from '@/components/dashboard/inventory-table'
import DailyLogFeed from '@/components/dashboard/daily-log-feed'
import { PlusCircle, HandMetal } from "lucide-react"

export default async function AdminPage() {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    const adminClient = getSupabaseAdmin()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role?.toUpperCase() !== 'ADMIN') {
        redirect('/')
    }

    const fullName = `${profile.first_name} ${profile.last_name}`
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <DashboardLayout userName={fullName} userRole="Lab Director" title="Admin Dashboard">

            {/* Hero Section */}
            <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden gap-6 md:gap-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cashcrow-primary)] opacity-[0.02] rounded-full -mr-16 -mt-16"></div>

                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 relative z-10 text-center sm:text-left">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-cashcrow-primary)]/10 flex items-center justify-center text-[var(--color-cashcrow-primary)] shadow-inner border border-[var(--color-cashcrow-primary)]/5 shrink-0">
                        <HandMetal className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Welcome back, {profile.first_name}</h2>
                        <p className="text-slate-500 text-sm md:text-base font-semibold tracking-wide flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                            Inventory overview for <span className="text-[var(--color-cashcrow-primary)]">{today}</span>
                        </p>
                    </div>
                </div>

                <button className="w-full sm:w-auto bg-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-lightgreen)] text-white px-8 py-4 rounded-xl font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-[var(--color-cashcrow-primary)]/20 active:scale-95 group relative z-10">
                    <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Create Today&apos;s Log
                </button>
            </div>

            {/* Stats Grid */}
            <StatsGrid />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Inventory Table */}
                <div className="lg:col-span-2">
                    <InventoryTable />
                </div>

                {/* Daily Log Feed */}
                <div>
                    <DailyLogFeed />
                </div>
            </div>
        </DashboardLayout>
    )
}
