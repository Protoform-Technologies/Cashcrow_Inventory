'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { deleteMember } from "@/actions/members"
import EditMemberForm from "./edit-member-form"
import { Pencil, Trash2, Loader2, Search, UserCircle, Mail, Shield, CheckCircle2, Clock, X, ChevronLeft, ChevronRight, UserPlus, User } from "lucide-react"
import { useRouter } from "next/navigation"
import AddMemberForm from "./add-member-form"

interface Profile {
    id: string
    first_name: string
    last_name: string
    email: string
    role: string
    is_active: boolean
    avatar_url?: string
}

const ITEMS_PER_PAGE = 5

export default function MembersList({ members }: { members: Profile[] }) {
    const [isPending, setIsPending] = useState(false)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
    const [editingMember, setEditingMember] = useState<Profile | null>(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [localMembers, setLocalMembers] = useState<Profile[]>(members)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const router = useRouter()

    // Filter members based on search
    const filteredMembers = localMembers.filter(member =>
        member.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Pagination
    const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedMembers = filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleEdit = (member: Profile) => {
        setEditingMember(member)
    }

    const handleEditClose = () => {
        setEditingMember(null)
    }

    const handleEditSuccess = () => {
        setEditingMember(null)
        router.refresh()
    }

    const handleAddSuccess = () => {
        setShowAddModal(false)
        router.refresh()
    }

    const handleDelete = (id: string) => {
        setDeleteConfirmId(id)
    }

    const confirmDelete = async () => {
        if (!deleteConfirmId) return

        setIsPending(true)
        const result = await deleteMember(deleteConfirmId)
        if (result?.success) {
            setLocalMembers(prev => prev.filter(m => m.id !== deleteConfirmId))
        }
        setDeleteConfirmId(null)
        setIsPending(false)
    }

    const handleCancelDelete = () => {
        setDeleteConfirmId(null)
    }

    // Get initials for avatar
    const getInitials = (firstName: string | null | undefined, lastName: string | null | undefined) => {
        const first = firstName?.charAt(0) || ''
        const last = lastName?.charAt(0) || ''
        return `${first}${last}`.toUpperCase() || '?'
    }

    // Get avatar color based on role
    const getAvatarColor = (role: string) => {
        if (role === 'ADMIN') return 'bg-primary/20 text-primary'
        if (role === 'MEMBER') return 'bg-blue-100 text-blue-600'
        return 'bg-slate-100 text-slate-600'
    }

    // Get role badge color
    const getRoleBadgeColor = (role: string) => {
        if (role === 'ADMIN') return 'bg-green-100 text-green-800'
        if (role === 'MEMBER') return 'bg-blue-100 text-blue-800'
        return 'bg-slate-100 text-slate-800'
    }

    // Mobile Member Card Component
    const MemberCard = ({ member }: { member: Profile }) => {
        const isConfirmingDelete = deleteConfirmId === member.id

        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-slate-100">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-10 h-10 rounded-xl overflow-hidden ${getAvatarColor(member.role)} flex items-center justify-center font-bold text-xs shrink-0`}>
                                {member.avatar_url ? (
                                    <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    getInitials(member.first_name, member.last_name)
                                )}
                            </div>
                            <div className="min-w-0 flex flex-col">
                                <h4 className="font-bold text-sm text-slate-900 truncate tracking-tight">{member.first_name} {member.last_name}</h4>
                            </div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full ${getRoleBadgeColor(member.role)}`}>
                            {member.role === 'ADMIN' ? 'Admin' : member.role === 'MEMBER' ? 'Member' : 'Viewer'}
                        </span>
                    </div>
                </div>

                {/* Body */}
                <div className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-3">
                        <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="text-xs text-slate-600 truncate font-medium">{member.email}</span>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-4 pb-4 pt-1 flex gap-2">
                    <button
                        onClick={() => handleEdit(member)}
                        className="flex-1 p-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 hover:border-primary"
                    >
                        <Pencil className="w-3 h-3" />
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(member.id)}
                        className="flex-1 p-2 bg-red-50 border border-red-200 rounded-lg text-xs font-bold text-red-700 hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                    >
                        <Trash2 className="w-3 h-3" />
                        Delete
                    </button>
                </div>
            </div>
        );
    };

    if (!localMembers || localMembers.length === 0) {
        return (
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Current Lab Members</h3>
                </div>
                <div className="p-12 text-center">
                    <p className="text-slate-500">No members found.</p>
                </div>
            </section>
        )
    }

    return (
        <>
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
                {/* Header with Search & Add Button */}
                <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-[#265136]" />
                        <h3 className="text-base md:text-lg font-bold text-slate-800 tracking-tight text-center sm:text-left">Lab Directory</h3>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-64 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#265136] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="w-full h-10 pl-10 pr-10 rounded-full border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] outline-none transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchQuery("")
                                        setCurrentPage(1)
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                        <Button
                            onClick={() => setShowAddModal(true)}
                            className="bg-[#265136] hover:bg-[#1f422b] text-white h-10 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#265136]/10 transition-all active:scale-95 w-full sm:w-auto"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add Member
                        </Button>
                    </div>
                </div>

                {/* Responsive Members Display */}
                <div className="space-y-4 md:space-y-0">
                    {/* Mobile Cards */}
                    <div className="md:hidden grid grid-cols-1 gap-2 p-3 bg-slate-50/50">
                        {paginatedMembers.map((member) => (
                            <MemberCard key={member.id} member={member} />
                        ))}
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[550px]">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Member</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginatedMembers.map((member) => (
                                    <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 text-slate-900 font-bold">
                                                <div className={`w-9 h-9 rounded-full overflow-hidden ${getAvatarColor(member.role)} flex items-center justify-center font-bold text-xs shrink-0`}>
                                                    {member.avatar_url ? (
                                                        <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        getInitials(member.first_name, member.last_name)
                                                    )}
                                                </div>
                                                <span className="text-sm truncate">{member.first_name} {member.last_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="flex items-center gap-2 font-medium">
                                                <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                                                <span className="text-xs truncate">{member.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full ${getRoleBadgeColor(member.role)}`}>
                                                {member.role === 'ADMIN' ? 'Admin' : member.role === 'MEMBER' ? 'Member' : 'Viewer'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() => handleEdit(member)}
                                                    className="p-1.5 text-slate-400 hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(member.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Table Footer - Refined Alignment */}
                {totalPages > 1 && (
                    <div className="p-4 md:p-6 bg-slate-50/50 border-t border-slate-100">
                        <div className="md:hidden grid grid-cols-2 gap-3 mb-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="h-10 border border-slate-200 rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold text-xs"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="h-10 border border-slate-200 rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold text-xs"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="hidden md:flex items-center justify-between text-xs font-bold text-slate-500">
                            <p className="tracking-wide">Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredMembers.length)} of {filteredMembers.length} members</p>
                            <div className="flex gap-1.5">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 h-8 border border-slate-200 rounded-lg hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-1"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                    Prev
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-8 h-8 flex items-center justify-center border rounded-full transition-colors ${currentPage === page
                                            ? 'bg-[#265136] text-white border-[#265136]'
                                            : 'border-slate-200 hover:bg-white'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 h-8 border border-slate-200 rounded-lg hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-1"
                                >
                                    Next
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Edit Modal */}
            {editingMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg m-2 overflow-hidden border border-slate-200">
                        <div className="bg-slate-50 border-b border-slate-100 px-6 py-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Edit Profile</h3>
                                <p className="text-slate-500 text-sm font-semibold tracking-wide">Modify access levels and contact info</p>
                            </div>
                            <button
                                onClick={handleEditClose}
                                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <EditMemberForm
                                member={editingMember}
                                onSuccess={handleEditSuccess}
                                onCancel={handleEditClose}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm m-2 overflow-hidden border border-slate-200">
                        <div className="p-8 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-red-600 animate-pulse">
                                    <Trash2 className="w-7 h-7" />
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">Are you sure?</h3>
                            <p className="text-slate-500 font-bold mb-8">This will permanently remove the member from your organization.</p>

                            <div className="flex flex-col w-full gap-3">
                                <Button
                                    onClick={confirmDelete}
                                    disabled={isPending}
                                    className="h-12 w-full bg-red-600 hover:bg-red-700 text-white font-black rounded-full shadow-lg shadow-red-200 transition-all active:scale-95"
                                >
                                    {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                    Yes, Delete Member
                                </Button>
                                <Button
                                    onClick={handleCancelDelete}
                                    variant="outline"
                                    className="h-12 w-full border-slate-200 text-slate-600 font-bold rounded-full hover:bg-slate-50 transition-all active:scale-95"
                                >
                                    Keep Member
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Add Member Modal - Restored */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg m-2 overflow-hidden border border-slate-200">
                        <div className="bg-slate-50 border-b border-slate-100 px-6 py-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Onboard Member</h3>
                                <p className="text-slate-500 text-sm font-semibold tracking-wide">Invite a new laboratory technician or admin</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <AddMemberForm
                                onSuccess={handleAddSuccess}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

