import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/layout'
import AddMemberForm from '@/components/dashboard/add-member-form'
import MembersList from '@/components/dashboard/members-list'

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
            {/* Header Section */}
            <header className="bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 px-8 py-4">
                <nav className="flex items-center gap-2 text-sm font-medium mb-1">
                    <a className="text-slate-500 hover:text-primary" href="#">Management</a>
                    <span className="text-slate-300">/</span>
                    <span className="text-primary">Members</span>
                </nav>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Add New Member</h2>
                <p className="text-slate-500 text-sm">Expand your team and manage access levels for your lab inventory.</p>
            </header>

            {/* Main Content */}
            <div className="p-8 max-w-6xl mx-auto space-y-8">
                {/* Form Section */}
                <section className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg font-semibold">Member Information</h3>
                    </div>
                    <AddMemberForm />
                </section>

                {/* List Section */}
                <MembersList members={members || []} />
            </div>
        </DashboardLayout>
    )
}
