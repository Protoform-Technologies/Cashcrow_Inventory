import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/layout'
import AddMemberForm from '@/components/dashboard/add-member-form'
import MembersList from '@/components/dashboard/members-list'
import { UserPlus } from "lucide-react"

export default async function AddMembersPage() {
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

    // Fetch all members to display in the UI
    const { data: members, error: membersError } = await adminClient
        .from('profiles')
        .select('id, first_name, last_name, email, role, is_active')
        .order('first_name', { ascending: true })

    if (membersError) {
        console.error('Failed to fetch members data:', membersError.message)
    }

    return (
        <DashboardLayout userName={fullName} userRole="Lab Director" title="Add Members">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden gap-6 md:gap-0 mt-4 mb-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cashcrow-primary)] opacity-[0.02] rounded-full -mr-16 -mt-16"></div>

                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 relative z-10 text-center sm:text-left">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-cashcrow-primary)]/10 flex items-center justify-center text-[var(--color-cashcrow-primary)] shadow-inner border border-[var(--color-cashcrow-primary)]/5 shrink-0">
                        <UserPlus className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Add Team Members</h2>
                        <p className="text-slate-500 text-sm md:text-base font-semibold tracking-wide flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                            Invite new users to the Cashcrow inventory system
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-center py-6">
                <AddMemberForm />
            </div>

            <div className="w-full py-6 pb-20">
                <MembersList members={members || []} />
            </div>
        </DashboardLayout>
    )
}
