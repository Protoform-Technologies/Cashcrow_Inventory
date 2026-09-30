'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Download, Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { deleteSupplier } from '@/actions/suppliers'
import EditSupplierForm from './edit-supplier-form'
import { generateSupplierPDF } from './supplier-card'
import Modal from '@/components/ui/modal'

interface Supplier {
    id: string
    company_name: string
    website: string | null
    contact_name: string | null
    email: string | null
    phone: string | null
    lead_time: number
    payment_terms: string
    category: string
    gst_no: string | null
    bank_account: string | null
    ifsc: string | null
    branch: string | null
    payment_id: string | null
    created_at: string
}

interface SupplierDetailActionsProps {
    supplier: Supplier
}

export default function SupplierDetailActions({ supplier }: SupplierDetailActionsProps) {
    const router = useRouter()
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState('')

    const handleDelete = async () => {
        setIsDeleting(true)
        setDeleteError('')
        try {
            const result = await deleteSupplier(supplier.id)
            if (result.success) {
                toast.success('Supplier deleted successfully')
                router.push('/admin/suppliers')
            } else {
                setDeleteError(result.error || 'Failed to delete supplier')
                toast.error(result.error || 'Failed to delete supplier')
                setIsDeleting(false)
            }
        } catch {
            setDeleteError('An unexpected error occurred during deletion.')
            setIsDeleting(false)
        }
    }

    return (
        <>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
                <button
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-[#265035] border border-[#2f6443] text-white rounded-xl text-sm font-bold hover:bg-[#2f6443] transition-all shadow-sm active:scale-95"
                >
                    <Pencil className="w-4 h-4" />
                    Edit Supplier
                </button>

                <button
                    onClick={() => generateSupplierPDF(supplier)}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                >
                    <Download className="w-4 h-4" />
                    Download PDF
                </button>

                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 hover:border-red-200 transition-all shadow-sm active:scale-95"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Supplier
                </button>
            </div>

            {/* Edit Modal */}
            <Modal open={showEditModal} onClose={() => setShowEditModal(false)} size="xl" showCloseButton>
                <div className="p-8">
                    <EditSupplierForm
                        supplier={supplier}
                        onSuccess={() => {
                            setShowEditModal(false)
                            router.refresh()
                        }}
                        onCancel={() => setShowEditModal(false)}
                    />
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={showDeleteConfirm}
                onClose={() => { setShowDeleteConfirm(false); setDeleteError('') }}
                size="sm"
            >
                <div className="p-8">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Delete this supplier?</h3>
                    <p className="text-slate-500 text-center text-sm mb-8">
                        This action is permanent and will remove <span className="font-bold text-slate-800">{supplier.company_name}</span> from the system.
                    </p>

                    {deleteError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">
                            {deleteError}
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Deletion'}
                        </button>
                        <button
                            onClick={() => {
                                setShowDeleteConfirm(false)
                                setDeleteError('')
                            }}
                            disabled={isDeleting}
                            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
