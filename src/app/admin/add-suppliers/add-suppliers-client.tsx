'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
    ChevronRight, 
    Building2, 
    Settings,
    Save,
    User,
    CheckCircle,
    AlertCircle,
    PlusCircle,
    X,
    Pencil,
    Trash2,
    Loader2,
    ChevronLeft
} from 'lucide-react'
import { addSupplier, deleteSupplier } from '@/actions/suppliers'
import EditSupplierForm from '@/components/dashboard/edit-supplier-form'
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

const ITEMS_PER_PAGE = 5

function getPaymentTermsLabel(value: string) {
    const labels: Record<string, string> = {
        'immediate': 'Immediate',
        'net15': 'Net 15',
        'net30': 'Net 30',
        'net45': 'Net 45',
        'net60': 'Net 60',
        'net90': 'Net 90',
        'cod': 'COD',
        'due_on_receipt': 'Due on Receipt'
    }
    return labels[value] || value
}

function getCategoryLabel(value: string) {
    const labels: Record<string, string> = {
        'logistics': 'Logistics',
        'manufacturing': 'Manufacturing',
        'it_services': 'IT Services',
        'office_supplies': 'Office Supplies',
        'electronics': 'Electronics',
        'other': 'Other'
    }
    return labels[value] || value
}

export default function AddSuppliersClient({ userName, suppliers: initialSuppliers }: AddSuppliersClientProps) {
    const [showAddForm, setShowAddForm] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [localSuppliers, setLocalSuppliers] = useState<Supplier[]>(initialSuppliers)
    const [currentPage, setCurrentPage] = useState(1)

    const [formData, setFormData] = useState({
        company_name: '',
        website: '',
        contact_name: '',
        email: '',
        phone: '',
        lead_time: '',
        payment_terms: '',
        category: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    const totalPages = Math.ceil(localSuppliers.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedSuppliers = localSuppliers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
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
            setFormData({
                company_name: '',
                website: '',
                contact_name: '',
                email: '',
                phone: '',
                lead_time: '',
                payment_terms: '',
                category: ''
            })
            // Refresh the page to show new supplier
            window.location.reload()
        } else {
            setFormStatus({ type: 'error', message: result?.error || 'Failed to add supplier' })
        }
    }

    const handleCancel = () => {
        setShowAddForm(false)
        setFormStatus(null)
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
                {showAddForm && (
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Add New Supplier</h3>
                                <p className="text-slate-500 text-sm">Fill in the details to add a new supplier.</p>
                            </div>
                            <button onClick={handleCancel} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {formStatus && (
                            <div className={`mx-6 mt-4 p-4 rounded-xl flex items-center gap-3 ${formStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {formStatus.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                                <p className="font-semibold">{formStatus.message}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="p-6">
                            {/* Section 1: General Information */}
                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                                        General Information
                                    </h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Company Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="company_name"
                                            value={formData.company_name}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] px-4 py-3 transition-all"
                                            placeholder="e.g. Global Logistics Inc."
                                            required
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Website
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-sm">
                                                https://
                                            </span>
                                            <input
                                                name="website"
                                                value={formData.website}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] pl-16 pr-4 py-3 transition-all"
                                                placeholder="www.company.com"
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: Contact Details */}
                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <User className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                                        Contact Details
                                    </h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Primary Contact Name
                                        </label>
                                        <input
                                            name="contact_name"
                                            value={formData.contact_name}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] px-4 py-3 transition-all"
                                            placeholder="John Doe"
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] px-4 py-3 transition-all"
                                            placeholder="john@company.com"
                                            type="email"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] px-4 py-3 transition-all"
                                            placeholder="+1 (555) 000-0000"
                                            type="tel"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Operational Information */}
                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Settings className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                                        Operational Information
                                    </h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Typical Lead Time
                                        </label>
                                        <div className="relative">
                                            <input
                                                name="lead_time"
                                                value={formData.lead_time}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] pl-4 pr-12 py-3 transition-all"
                                                placeholder="7"
                                                type="number"
                                            />
                                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 text-sm">
                                                Days
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Payment Terms <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="payment_terms"
                                            value={formData.payment_terms}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] px-4 py-3 transition-all"
                                            required
                                        >
                                            <option disabled value="">Select Terms</option>
                                            <option value="immediate">Immediate</option>
                                            <option value="net15">Net 15</option>
                                            <option value="net30">Net 30</option>
                                            <option value="net45">Net 45</option>
                                            <option value="net60">Net 60</option>
                                            <option value="net90">Net 90</option>
                                            <option value="cod">COD (Cash on Delivery)</option>
                                            <option value="due_on_receipt">Due on Receipt</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] px-4 py-3 transition-all"
                                            required
                                        >
                                            <option disabled value="">Select Category</option>
                                            <option value="logistics">Logistics</option>
                                            <option value="manufacturing">Manufacturing</option>
                                            <option value="it_services">IT Services</option>
                                            <option value="office_supplies">Office Supplies</option>
                                            <option value="electronics">Electronics</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <button 
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-2.5 rounded-lg bg-[var(--color-cashcrow-primary)] text-white font-semibold shadow-lg shadow-[var(--color-cashcrow-primary)]/20 hover:bg-[var(--color-cashcrow-primary)]/90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-[18px] h-[18px] animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-[18px] h-[18px]" />
                                            Save Supplier
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {localSuppliers && localSuppliers.length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 px-3 md:px-6 py-3 md:py-4 flex items-center gap-2 flex-wrap">
                            <Building2 className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-cashcrow-primary)]" />
                            <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-700">Suppliers</h3>
                            <span className="ml-auto text-xs font-bold bg-[var(--color-cashcrow-primary)] text-white px-2 py-0.5 md:px-2.5 md:py-1 rounded-full">
                                {localSuppliers.length}
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[650px] md:min-w-0">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-500 text-[10px] uppercase tracking-[0.15em] font-black border-b border-slate-100">
                                        <th className="px-2 md:px-6 py-3 md:py-4">Company</th>
                                        <th className="px-2 md:px-6 py-3 md:py-4">Contact</th>
                                        <th className="px-2 md:px-6 py-3 md:py-4">Email</th>
                                        <th className="px-2 md:px-6 py-3 md:py-4">Category</th>
                                        <th className="px-2 md:px-6 py-3 md:py-4">Terms</th>
                                        <th className="px-2 md:px-6 py-3 md:py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {paginatedSuppliers.map((supplier) => {
                                        if (deleteConfirmId === supplier.id) {
                                            return (
                                                <tr key={supplier.id} className="bg-red-50">
                                                    <td colSpan={6} className="px-6 py-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                                                    <Trash2 className="w-5 h-5" />
                                                                </div>
                                                                <p className="font-medium text-red-600">Delete {supplier.company_name}?</p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button onClick={confirmDelete} disabled={isDeleting} size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                                                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                                                                </Button>
                                                                <Button onClick={handleCancelDelete} variant="outline" size="sm">Cancel</Button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        
                                        return (
                                            <tr key={supplier.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-2 md:px-6 py-3 md:py-5">
                                                    <div className="flex items-center gap-2 md:gap-3">
                                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                                            <Building2 className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                                                        </div>
                                                        <p className="font-bold text-slate-900 group-hover:text-[var(--color-cashcrow-primary)] transition-colors text-xs md:text-sm truncate max-w-[80px] md:max-w-none">{supplier.company_name}</p>
                                                    </div>
                                                </td>
                                                <td className="px-2 md:px-6 py-3 md:py-5">
                                                    <span className="text-xs md:text-sm text-slate-600 font-medium">{supplier.contact_name || '-'}</span>
                                                </td>
                                                <td className="px-2 md:px-6 py-3 md:py-5">
                                                    <span className="text-xs md:text-sm text-slate-500">{supplier.email || '-'}</span>
                                                </td>
                                                <td className="px-2 md:px-6 py-3 md:py-5">
                                                    <span className="text-xs md:text-sm text-slate-600 font-medium bg-slate-100 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg">{getCategoryLabel(supplier.category)}</span>
                                                </td>
                                                <td className="px-2 md:px-6 py-3 md:py-5">
                                                    <span className="text-xs md:text-sm text-slate-600">{getPaymentTermsLabel(supplier.payment_terms)}</span>
                                                </td>
                                                <td className="px-2 md:px-6 py-3 md:py-5 text-right">
                                                    <div className="flex justify-end gap-1 md:gap-2">
                                                        <button onClick={() => handleEdit(supplier)} className="p-1 md:p-2 text-slate-400 hover:text-primary transition-colors">
                                                            <Pencil className="w-3.5 h-3.5 md:w-5 md:h-5" />
                                                        </button>
                                                        <button onClick={() => handleDelete(supplier.id)} className="p-1 md:p-2 text-slate-400 hover:text-red-500 transition-colors">
                                                            <Trash2 className="w-3.5 h-3.5 md:w-5 md:h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                                <p>Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, localSuppliers.length)} of {localSuppliers.length} suppliers</p>
                                <div className="flex gap-2">
                                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-1">
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1 border rounded transition-colors ${currentPage === page ? 'bg-[var(--color-cashcrow-primary)] text-white border-[var(--color-cashcrow-primary)]' : 'border-slate-200 hover:bg-slate-50'}`}>
                                            {page}
                                        </button>
                                    ))}
                                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-1">
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {localSuppliers && localSuppliers.length === 0 && (
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">
                        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 mb-2">No Suppliers Yet</h3>
                        <p className="text-slate-500 text-sm">Your supplier list is empty. Click "Add New Supplier" to get started.</p>
                    </div>
                )}
            </div>

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

