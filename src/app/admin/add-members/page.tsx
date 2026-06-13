import { getAdminProfileOrRedirect } from '@/actions/auth'
import { dbGetMembers } from '@/lib/members'
import MembersList from '@/components/admin/members/members-list'
import { Metadata } from 'next'
import { Users, ShieldCheck, UserCheck, UserMinus, UserPlus } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Team Management | Cashcrow',
    description: 'Manage your laboratory team, assign roles, and monitor access levels.',
}

export default async function AddMembersPage() {
    const profile = await getAdminProfileOrRedirect()
    const members = await dbGetMembers()

    const fullName = `${profile.first_name} ${profile.last_name}`

    // Calculate Member Statistics
    const stats = [
        {
            label: 'Total Team',
            value: members.length,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            label: 'Administrators',
            value: members.filter(m => m.role === 'ADMIN').length,
            icon: ShieldCheck,
            color: 'text-[#265136]',
            bgColor: 'bg-[#265136]/10'
        },
        {
            label: 'Members',
            value: members.filter(m => m.role === 'MEMBER').length,
            icon: UserCheck,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50'
        }
    ]

    return (
        <div className="space-y-8">
            {/* Simple Header Pattern */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Team Management</h2>
                <p className="text-slate-500 font-medium">
                    Manage access levels and onboard new laboratory members.
                </p>
            </div>

            {/* Member Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                        <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center shrink-0`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content - Professional List View */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800 px-1">Directory</h3>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <MembersList members={members} currentUserId={profile.id} />
                </div>
            </div>
        </div>
    )
}
