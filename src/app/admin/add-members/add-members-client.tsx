'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/layout'
import AddMemberForm from '@/components/dashboard/add-member-form'
import MembersList from '@/components/dashboard/members-list'
import { PlusCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Profile {
    id: string
    first_name: string
    last_name: string
    email: string
    role: string
    is_active: boolean
}

interface AddMembersClientProps {
    userName: string
    avatarUrl?: string
    members: Profile[]
}

export default function AddMembersClient({ userName, avatarUrl, members }: AddMembersClientProps) {
    const [showAddForm, setShowAddForm] = useState(false)
    const [localMembers, setLocalMembers] = useState<Profile[]>(members)

    const handleSuccess = () => {
        setShowAddForm(false)
        // The form submission will trigger a revalidation via server action
        // For immediate UI update, we can refresh the page or use router.refresh()
    }

    const handleCancel = () => {
        setShowAddForm(false)
    }

    const handleMemberAdded = () => {
        // Refresh the members list after successful addition
        window.location.reload()
    }

    return (
        <DashboardLayout userName={userName} userRole="Lab Director" avatarUrl={avatarUrl} title="Add Members">
            {/* Title and Button Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-2">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900">Team Members</h2>
                    <p className="text-slate-500 text-sm">Manage your lab team and access levels.</p>
                </div>
                {!showAddForm && (
                    <Button
                        onClick={() => setShowAddForm(true)}
                        className="bg-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-primary)]/90 text-white font-semibold py-2.5 md:py-2 px-4 md:px-6 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 w-full sm:w-auto text-sm md:text-base"
                    >
                        <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
                        Add Member
                    </Button>
                )}
            </div>

            {/* Main Content */}
            <div className="space-y-6 md:space-y-8">
                {/* Form Section - Conditionally Rendered */}
                {showAddForm && (
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Add New Member</h3>
                                <p className="text-slate-500 text-sm">Fill in the details to invite a new team member.</p>
                            </div>
                            <button
                                onClick={handleCancel}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <AddMemberForm onSuccess={handleMemberAdded} />
                    </section>
                )}

                {/* List Section - Always Visible */}
                <MembersList members={localMembers} />
            </div>
        </DashboardLayout>
    )
}

