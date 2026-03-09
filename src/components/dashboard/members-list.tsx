'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { deleteMember } from "@/actions/members"
import EditMemberForm from "./edit-member-form"
import { Pencil, Trash2, Loader2, Search, UserCircle, Mail, Shield, CheckCircle2, Clock, X, ChevronLeft, ChevronRight } from "lucide-react"

interface Profile {
    id: string
    first_name: string
    last_name: string
    email: string
    role: string
    is_active: boolean
}

const ITEMS_PER_PAGE = 5

export default function MembersList({ members }: { members: Profile[] }) {
    const [isPending, setIsPending] = useState(false)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
    const [editingMember, setEditingMember] = useState<Profile | null>(null)
    const [localMembers, setLocalMembers] = useState<Profile[]>(members)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

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
        window.location.reload()
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
                {/* Header with Search */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Current Lab Members</h3>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <Search className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="Filter members..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="pl-10 text-sm rounded-full border border-slate-300 h-9 w-48 focus:w-64 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
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
                                    {deleteConfirmId === member.id ? (
                                        // Delete Confirmation
                                        <>
                                            <td className="px-6 py-4" colSpan={2}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                                        <Trash2 className="w-5 h-5" />
                                                    </div>
                                                    <p className="font-medium text-red-600">Delete {member.first_name} {member.last_name}?</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-500">This action cannot be undone.</p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button 
                                                        onClick={confirmDelete} 
                                                        disabled={isPending}
                                                        size="sm"
                                                        className="bg-red-600 hover:bg-red-700 text-white"
                                                    >
                                                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                                                    </Button>
                                                    <Button 
                                                        onClick={handleCancelDelete} 
                                                        variant="outline" 
                                                        size="sm"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        // View Mode
                                        <>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full ${getAvatarColor(member.role)} flex items-center justify-center font-bold text-sm`}>
                                                        {getInitials(member.first_name, member.last_name)}
                                                    </div>
                                                    <span className="font-medium">{member.first_name} {member.last_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    {member.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                                                    {member.role === 'ADMIN' ? 'Admin' : member.role === 'MEMBER' ? 'Member' : 'Viewer'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleEdit(member)}
                                                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                    >
                                                        <Pencil className="w-5 h-5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(member.id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                        <p>Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredMembers.length)} of {filteredMembers.length} members</p>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-1" 
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 border rounded transition-colors ${
                                        currentPage === page 
                                            ? 'bg-[var(--color-cashcrow-primary)] text-white border-[var(--color-cashcrow-primary)]' 
                                            : 'border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-1"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* Edit Modal */}
            {editingMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4">
                        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Edit Member</h3>
                                <p className="text-slate-500 text-sm">Update member details below.</p>
                            </div>
                            <button
                                onClick={handleEditClose}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <EditMemberForm 
                            member={editingMember} 
                            onSuccess={handleEditSuccess} 
                            onCancel={handleEditClose} 
                        />
                    </div>
                </div>
            )}
        </>
    )
}

