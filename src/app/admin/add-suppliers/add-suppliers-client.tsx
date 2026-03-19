'use client'

import { useState } from 'react'
import { PlusCircle, X } from 'lucide-react'
import { addSupplier, deleteSupplier } from '@/actions/suppliers'
import EditSupplierForm from '@/components/dashboard/edit-supplier-form'
import AddSupplierForm from '@/components/dashboard/add-supplier-form'
import SuppliersTable from '@/components/dashboard/suppliers-table'
import { Button } from '@/components/ui/button'

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
    created_at: string
}

interface AddSuppliersClientProps {
    userName: string
    suppliers: Supplier[]
}

const ITEMS_PER_PAGE = 9

interface FormData {
    company_name: string
    website: string
    contact_name: string
    email: string
    phone: string
    lead_time: string
    payment_terms: string
    category: string
}

const initialFormData: FormData = {
    company_name: '',
    website: '',
    contact_name: '',
    email: '',
    phone: '',
    lead_time: '',
    payment_terms: '',
    category: ''
}

export default function AddSuppliersClient({ userName, suppliers: initialSuppliers }: AddSuppliersClientProps) {
    const [showAddForm, setShowAddForm] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [localSuppliers, setLocalSuppliers] = useState<Supplier[]>(initialSuppliers)
    const [currentPage, setCurrentPage] = useState(1)

    const [formData, setFormData] = useState<FormData>(initialFormData)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    const totalPages = Math.ceil(localSuppliers.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedSuppliers = localSuppliers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setFormStatus(null)
        
        const formDataObj = new FormData()
        formDataObj.append('company_name', formData.company_name)
        formDataObj.append('website', formData.website)
        formDataObj.append('contact_name', formData.contact_name)
        formDataObj.append('email', formData.email)
        formDataObj.append('phone', formData.phone)
        formDataObj.append('lead_time', formData.lead_time || '7')
        formDataObj.append('payment_terms', formData.payment_terms)
        formDataObj.append('category', formData.category)

        const result = await addSupplier(formDataObj)
        
        setIsSubmitting(false)
        
        if (result?.success) {
            setFormStatus({ type: 'success', message: 'Supplier added successfully!' })
            setFormData(initialFormData)
            window.location.reload()
        } else {
            setFormStatus({ type: 'error', message: result?.error || 'Failed to add supplier' })
        }
    }

    const handleCancel = () => {
        setShowAddForm(false)
        setFormStatus(null)
        setFormData(initialFormData)
    }

    const handleEdit = (supplier: Supplier) => {
        setEditingSupplier(supplier)
        setShowEditModal(true)
    }

    const handleEditClose = () => {
        setShowEditModal(false)
        setEditingSupplier(null)
    }

    const handleEditSuccess = () => {
        setShowEditModal(false)
        setEditingSupplier(null)
        window.location.reload()
    }

    const handleDelete = (id: string) => {
        setDeleteConfirmId(id)
    }

    const confirmDelete = async () => {
        if (!deleteConfirmId) return
        setIsDeleting(true)
        const result = await deleteSupplier(deleteConfirmId)
        if (result?.success) {
            setLocalSuppliers(prev => prev.filter(s => s.id !== deleteConfirmId))
        }
        setDeleteConfirmId(null)
        setIsDeleting(false)
    }

    const handleCancelDelete = () => {
        setDeleteConfirmId(null)
    }

    return (
        <div className="w-full">
            {/* Title and Button Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-2">
                <div></div>
                {!showAddForm && (
                    <Button
                        onClick={() => setShowAddForm(true)}
                        className="bg-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-primary)]/90 text-white font-semibold py-2.5 md:py-2 px-4 md:px-6 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 w-full sm:w-auto text-sm md:text-base"
                    >
                        <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="md:hidden lg:inline">Add New Supplier</span>
                        <span className="hidden md:inline lg:hidden">Add Supplier</span>
                    </Button>
                )}
            </div>
            <p className="text-slate-500 text-sm mb-6">Manage your suppliers and vendor contacts.</p>

            <div className="space-y-6 md:space-y-8">
                {/* Add Supplier Form */}
                {showAddForm && (
                    <AddSupplierForm
                        formData={formData}
                        setFormData={setFormData}
                        isSubmitting={isSubmitting}
                        formStatus={formStatus}
                        setFormStatus={setFormStatus}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                )}

                {/* Suppliers Table */}
                <SuppliersTable
                    suppliers={paginatedSuppliers}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    startIndex={startIndex}
                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                    deleteConfirmId={deleteConfirmId}
                    isDeleting={isDeleting}
                    onPageChange={handlePageChange}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onConfirmDelete={confirmDelete}
                    onCancelDelete={handleCancelDelete}
                />
            </div>

            {/* Edit Modal */}
            {showEditModal && editingSupplier && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-2">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg md:max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Edit Supplier</h3>
                                <p className="text-slate-500 text-sm">Update the supplier details below.</p>
                            </div>
                            <button onClick={handleEditClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 md:p-6">
                            <EditSupplierForm supplier={editingSupplier} onSuccess={handleEditSuccess} onCancel={handleEditClose} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

