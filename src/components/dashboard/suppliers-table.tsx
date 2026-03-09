'use client'

import { 
    Building2, 
    ChevronRight, 
    ChevronLeft,
    Pencil,
    Trash2,
    Loader2
} from 'lucide-react'
import { deleteSupplier } from '@/actions/suppliers'
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

interface SuppliersTableProps {
    suppliers: Supplier[]
    currentPage: number
    totalPages: number
    startIndex: number
    ITEMS_PER_PAGE: number
    deleteConfirmId: string | null
    isDeleting: boolean
    onPageChange: (page: number) => void
    onEdit: (supplier: Supplier) => void
    onDelete: (id: string) => void
    onConfirmDelete: () => void
    onCancelDelete: () => void
}

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

export default function SuppliersTable({
    suppliers,
    currentPage,
    totalPages,
    startIndex,
    ITEMS_PER_PAGE,
    deleteConfirmId,
    isDeleting,
    onPageChange,
    onEdit,
    onDelete,
    onConfirmDelete,
    onCancelDelete
}: SuppliersTableProps) {
    if (suppliers.length === 0) {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 mb-2">No Suppliers Yet</h3>
                <p className="text-slate-500 text-sm">Your supplier list is empty. Click "Add New Supplier" to get started.</p>
            </div>
        )
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-3 md:px-6 py-3 md:py-4 flex items-center gap-2 flex-wrap">
                <Building2 className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-cashcrow-primary)]" />
                <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-700">Suppliers</h3>
                <span className="ml-auto text-xs font-bold bg-[var(--color-cashcrow-primary)] text-white px-2 py-0.5 md:px-2.5 md:py-1 rounded-full">
                    {suppliers.length}
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
                        {suppliers.map((supplier) => {
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
                                                    <Button onClick={onConfirmDelete} disabled={isDeleting} size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                                                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                                                    </Button>
                                                    <Button onClick={onCancelDelete} variant="outline" size="sm">Cancel</Button>
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
                                            <button onClick={() => onEdit(supplier)} className="p-1 md:p-2 text-slate-400 hover:text-primary transition-colors">
                                                <Pencil className="w-3.5 h-3.5 md:w-5 md:h-5" />
                                            </button>
                                            <button onClick={() => onDelete(supplier.id)} className="p-1 md:p-2 text-slate-400 hover:text-red-500 transition-colors">
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
                    <p>Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, suppliers.length)} of {suppliers.length} suppliers</p>
                    <div className="flex gap-2">
                        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-1">
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button key={page} onClick={() => onPageChange(page)} className={`px-3 py-1 border rounded transition-colors ${currentPage === page ? 'bg-[var(--color-cashcrow-primary)] text-white border-[var(--color-cashcrow-primary)]' : 'border-slate-200 hover:bg-slate-50'}`}>
                                {page}
                            </button>
                        ))}
                        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-1">
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

