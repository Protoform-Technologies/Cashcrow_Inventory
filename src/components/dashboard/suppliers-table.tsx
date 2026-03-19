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
                <table className="w-full text-left border-collapse min-w-0 table-auto">
                    <thead>
                        <tr className="bg-slate-50/50 text-slate-500 text-[10px] uppercase tracking-[0.15em] font-black border-b border-slate-100">
                            <th className="w-[50%] px-2 md:px-6 py-3 md:py-4">Company</th>
                            <th className="hidden md:table-cell px-2 md:px-6 py-3 md:py-4">Contact</th>
                            <th className="hidden lg:table-cell px-2 md:px-6 py-3 md:py-4">Email</th>
                            <th className="hidden lg:table-cell px-2 md:px-6 py-3 md:py-4">Category</th>
                            <th className="hidden xl:table-cell px-2 md:px-6 py-3 md:py-4">Terms</th>
                            <th className="w-[12%] px-2 md:px-6 py-3 md:py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {suppliers.map((supplier) => {
                            if (deleteConfirmId === supplier.id) {
                                return (
                                    <tr key={supplier.id} className="bg-red-50">
                                        <td colSpan={6} className="px-4 py-8 text-center">
                                            <div className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-4 justify-center">
                                                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                                    <Trash2 className="w-6 h-6" />
                                                </div>
                                                <div className="text-center sm:text-left">
                                                    <p className="font-semibold text-red-800 text-lg">Delete supplier?</p>
                                                    <p className="text-red-600 text-sm mt-1">This action cannot be undone. Are you sure you want to delete <span className="font-medium">{supplier.company_name}</span>?</p>
                                                </div>
                                                <div className="flex gap-2 mt-4 sm:mt-0">
                                                    <Button onClick={onConfirmDelete} disabled={isDeleting} size="sm" className="bg-red-600 hover:bg-red-700 text-white font-medium">
                                                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                                        Delete
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
                                    <td className="px-3 md:px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                                <Building2 className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-slate-900 group-hover:text-[var(--color-cashcrow-primary)] transition-colors truncate text-sm">{supplier.company_name}</p>
                                                <span className="text-xs text-slate-500">{getCategoryLabel(supplier.category)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 md:px-6 py-4 hidden md:table-cell">
                                        <span className="text-sm text-slate-700 font-medium">{supplier.contact_name || '-'}</span>
                                    </td>
                                    <td className="px-3 md:px-6 py-4 hidden lg:table-cell max-w-[200px]">
                                        <span className="text-sm text-slate-600 truncate block">{supplier.email || '-'}</span>
                                    </td>
                                    <td className="px-3 md:px-6 py-4 hidden lg:table-cell">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                            {getPaymentTermsLabel(supplier.payment_terms)}
                                        </span>
                                    </td>
                                    <td className="px-3 md:px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={(e) => { e.stopPropagation(); onEdit(supplier); }} className="p-2 text-slate-400 hover:text-[var(--color-cashcrow-primary)] hover:bg-slate-100 rounded-lg transition-all">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); onDelete(supplier.id); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                <Trash2 className="w-4 h-4" />
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
                <div className="border-t border-slate-200 p-4 bg-slate-50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
                        <span>Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, suppliers.length)} of {suppliers.length} suppliers</span>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => onPageChange(currentPage - 1)} 
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="px-3 py-1 font-medium text-slate-900 bg-white border border-slate-200 rounded-lg shadow-sm">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button 
                                onClick={() => onPageChange(currentPage + 1)} 
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

