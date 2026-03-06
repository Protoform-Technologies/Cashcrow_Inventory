import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/layout'
import { PlusCircle, HandMetal } from "lucide-react"

export default async function MemberPage() {
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

    if (!profile || profile.role?.toUpperCase() !== 'MEMBER') {
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
        <DashboardLayout userName={fullName} userRole="Lab Member" title="Researcher Portal">

            {/* Hero Section */}
            <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden gap-6 md:gap-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cashcrow-lightgreen)] opacity-[0.02] rounded-full -mr-16 -mt-16"></div>

                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 relative z-10 text-center sm:text-left">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-cashcrow-lightgreen)]/10 flex items-center justify-center text-[var(--color-cashcrow-lightgreen)] shadow-inner border border-[var(--color-cashcrow-lightgreen)]/5 shrink-0">
                        <HandMetal className="w-8 h-8 rotate-12" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Active Session: {profile.first_name}</h2>
                        <p className="text-slate-500 text-sm md:text-base font-semibold tracking-wide flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                            Lab activity for <span className="text-[var(--color-cashcrow-lightgreen)]">{today}</span>
                        </p>
                    </div>
                </div>

                <button className="w-full sm:w-auto bg-[var(--color-cashcrow-lightgreen)] hover:bg-[#3d7a52] text-white px-8 py-4 rounded-xl font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-[var(--color-cashcrow-lightgreen)]/20 active:scale-95 group relative z-10">
                    <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Log Asset Movement
                </button>
            </div>

            {/* Profile Information Section */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900 border-b pb-4">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</p>
                        <p className="text-lg font-bold text-slate-700">{fullName}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                        <p className="text-lg font-bold text-slate-700">{user.email}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Designated Role</p>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-cashcrow-lightgreen)]/10 text-[var(--color-cashcrow-lightgreen)] text-sm font-bold border border-[var(--color-cashcrow-lightgreen)]/20">
                            {profile.role || 'Member'}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
