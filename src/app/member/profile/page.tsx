import { getMemberProfileOrRedirect } from '@/actions/auth'
import { createServerSupabaseClient } from '@/lib/supabase'
import DashboardLayout from '@/components/dashboard/layout'
import EditMemberForm from '@/components/dashboard/edit-member-form'
import { Button } from '@/components/ui/button'
import { User, Mail, BadgeCheck, Edit3 } from 'lucide-react'

export default async function ProfilePage() {
    const profile = await getMemberProfileOrRedirect()
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    const fullName = `${profile.first_name} ${profile.last_name}`

    return (
        <DashboardLayout userName={fullName} userRole="Lab Member" title="User Profile">
            <div className="space-y-8">
                {/* Hero Header */}
                <div className="bg-gradient-to-r from-[var(--color-cashcrow-lightgreen)]/5 to-white p-8 rounded-3xl border border-[var(--color-cashcrow-lightgreen)]/20 shadow-xl">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                        <div className="w-24 h-24 bg-[var(--color-cashcrow-lightgreen)]/20 rounded-2xl flex items-center justify-center border-4 border-white/50 shadow-2xl">
                            <User className="w-12 h-12 text-[var(--color-cashcrow-lightgreen)]" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                {fullName}
                            </h1>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-cashcrow-lightgreen)]/20 text-[var(--color-cashcrow-lightgreen)] rounded-xl font-bold border border-[var(--color-cashcrow-lightgreen)]/30 mt-2">
                                <BadgeCheck className="w-4 h-4" />
                                Lab Member
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Profile Details */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <User className="w-7 h-7 text-[var(--color-cashcrow-lightgreen)]" />
                            Profile Information
                        </h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                                <p className="text-2xl font-black text-slate-900">{fullName}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">Email</label>
                                <p className="text-lg font-semibold text-slate-700">{user!.email}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">Role</label>
                                <p className="text-lg font-bold text-[var(--color-cashcrow-lightgreen)]">MEMBER</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">Member Since</label>
                                <p className="text-lg text-slate-600">{new Date(profile.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <Edit3 className="w-7 h-7 text-[var(--color-cashcrow-primary)]" />
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EditMemberForm 
                                member={profile} 
                                onSuccess={() => window.location.reload()} 
                                onCancel={() => {}} 
                            />
                            <Button className="h-full bg-[var(--color-cashcrow-lightgreen)] hover:bg-[var(--color-cashcrow-primary)] text-white font-bold py-8 text-lg">
                                Download Activity Report
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

