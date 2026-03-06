import { UserCircle, Mail, Shield, CheckCircle2, Clock } from "lucide-react"

interface Profile {
    id: string
    first_name: string
    last_name: string
    email: string
    role: string
    is_active: boolean
}

export default function MembersList({ members }: { members: Profile[] }) {
    if (!members || members.length === 0) {
        return (
            <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center mt-8">
                <p className="text-slate-500 font-medium">No members found.</p>
            </div>
        )
    }

    return (
        <div className="w-full space-y-5 mt-8">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">Current Members ({members.length})</h3>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
                {members.map((member) => (
                    <div key={member.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex flex-shrink-0 items-center justify-center text-slate-400">
                                    <UserCircle className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-slate-900 leading-tight truncate">{member.first_name} {member.last_name}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">{member.role}</p>
                                </div>
                            </div>
                            <span className={`px-2.5 py-1 text-[10px] font-black rounded-full uppercase tracking-wider shrink-0 whitespace-nowrap ${member.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                {member.is_active ? 'Active' : 'Pending'}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-slate-50 text-slate-500">
                            <Mail className="w-4 h-4 shrink-0" />
                            <p className="text-sm font-medium truncate">{member.email}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 text-[10px] uppercase tracking-[0.15em] font-black border-b border-slate-100">
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {members.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[var(--color-cashcrow-primary)]/10 flex items-center justify-center text-[var(--color-cashcrow-primary)]">
                                                <UserCircle className="w-6 h-6" />
                                            </div>
                                            <p className="font-bold text-slate-900 group-hover:text-[var(--color-cashcrow-primary)] transition-colors">
                                                {member.first_name} {member.last_name}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm text-slate-600 font-bold bg-slate-100 px-3 py-1 rounded-lg">
                                                {member.role === 'ADMIN' ? 'Admin' : 'Member'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                                            <Mail className="w-4 h-4" />
                                            {member.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        {member.is_active ? (
                                            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full">
                                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                <span className="text-[11px] font-black uppercase tracking-wider">Active</span>
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full">
                                                <Clock className="w-4 h-4 shrink-0" />
                                                <span className="text-[11px] font-black uppercase tracking-wider">Pending Setup</span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
