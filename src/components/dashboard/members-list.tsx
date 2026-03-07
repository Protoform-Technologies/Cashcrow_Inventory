'use client'

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { deleteMember, updateMember } from "@/actions/members"
import { Pencil, Trash2, Loader2, Search, UserCircle, Mail, Shield, CheckCircle2, Clock } from "lucide-react"

interface Profile {
    id: string
    first_name: string
    last_name: string
    email: string
    role: string
    is_active: boolean
}

export default function MembersList({ members }: { members: Profile[] }) {
    const [isPending, startTransition] = useTransition()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState<Profile | null>(null)
    const [localMembers, setLocalMembers] = useState<Profile[]>(members)
    const [searchQuery, setSearchQuery] = useState("")

    // Update local members when prop changes
    if (JSON.stringify(members) !== JSON.stringify(localMembers) && editingId === null) {
        setLocalMembers(members)
    }

    // Filter members based on search
    const filteredMembers = localMembers.filter(member => 
        member.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleEdit = (member: Profile) => {
        setEditingId(member.id)
        setEditForm({ ...member })
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setEditForm(null)
    }

    const handleSaveEdit = async () => {
        if (!editForm) return

        const formData = new FormData()
        formData.append('firstName', editForm.first_name)
        formData.append('lastName', editForm.last_name)
        formData.append('role', editForm.role)
        formData.append('isActive', editForm.is_active.toString())

        startTransition(async () => {
            const result = await updateMember(editForm.id, formData)
            if (result?.success) {
                setLocalMembers(prev => prev.map(m => 
                    m.id === editForm.id ? { ...m, ...editForm } : m
                ))
                setEditingId(null)
                setEditForm(null)
            }
        })
    }

    const handleDelete = (id: string) => {
        setDeleteConfirmId(id)
    }

    const confirmDelete = () => {
        if (!deleteConfirmId) return

        startTransition(async () => {
            const result = await deleteMember(deleteConfirmId)
            if (result?.success) {
                setLocalMembers(prev => prev.filter(m => m.id !== deleteConfirmId))
                setDeleteConfirmId(null)
            }
        })
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
        if (role === 'MEMBER') return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
    }

    // Get role badge color
    const getRoleBadgeColor = (role: string) => {
        if (role === 'ADMIN') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        if (role === 'MEMBER') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
    }

    if (!localMembers || localMembers.length === 0) {
        return (
            <section className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Current Lab Members</h3>
                </div>
                <div className="p-12 text-center">
                    <p className="text-slate-500">No members found.</p>
                </div>
            </section>
        )
    }

    return (
        <section className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Header with Search */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Current Lab Members</h3>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <Search className="w-4 h-4" />
                    </span>
                    <input
                        type="text"
                        placeholder="Filter members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 text-sm rounded-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 h-9 w-48 focus:w-64 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Member</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredMembers.map((member) => (
                            <tr key={member.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                {editingId === member.id && editForm ? (
                                    // Edit Mode
                                    <>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full ${getAvatarColor(editForm.role)} flex items-center justify-center font-bold text-sm`}>
                                                    {getInitials(editForm.first_name, editForm.last_name)}
                                                </div>
                                                <div className="space-y-2 min-w-[180px]">
                                                    <input
                                                        type="text"
                                                        value={editForm.first_name}
                                                        onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                                                        className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        placeholder="First Name"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editForm.last_name}
                                                        onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                                                        className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        placeholder="Last Name"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                {member.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={editForm.role}
                                                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                                className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            >
                                                <option value="MEMBER">Member</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button 
                                                    onClick={handleSaveEdit} 
                                                    disabled={isPending}
                                                    size="sm"
                                                    className="bg-primary hover:bg-primary/90 text-white"
                                                >
                                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                                                </Button>
                                                <Button 
                                                    onClick={handleCancelEdit} 
                                                    variant="outline" 
                                                    size="sm"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </td>
                                    </>
                                ) : deleteConfirmId === member.id ? (
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
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
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
                                                    disabled={isPending}
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(member.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                    disabled={isPending}
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
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500">
                <p>Showing {filteredMembers.length} members</p>
                <div className="flex gap-2">
                    <button 
                        className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50" 
                        disabled
                    >
                        Previous
                    </button>
                    <button 
                        className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        disabled={filteredMembers.length < 10}
                    >
                        Next
                    </button>
                </div>
            </div>
        </section>
    )
}
