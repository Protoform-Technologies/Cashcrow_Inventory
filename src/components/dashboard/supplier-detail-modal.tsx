'use client'

import Link from 'next/link'
import { 
    X,
    ChevronRight,
    Pencil,
    Download,
    Mail,
    Globe,
    CreditCard,
    AlertTriangle
} from 'lucide-react'
import { generateSupplierPDF } from './supplier-card'

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

interface SupplierDetailModalProps {
    supplier: Supplier
    onClose: () => void
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

function getCategoryColor(category: string) {
    const colors: Record<string, string> = {
        'logistics': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        'manufacturing': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        'it_services': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
        'office_supplies': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
        'electronics': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        'other': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
    }
    return colors[category] || colors['other']
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

export default function SupplierDetailModal({ supplier, onClose }: SupplierDetailModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--color-cashcrow-bg-light)] dark:bg-[var(--color-cashcrow-bg-dark)] rounded-xl md:rounded-2xl shadow-2xl mx-2">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-3 right-3 md:top-4 md:right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-600 dark:text-slate-300 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Breadcrumbs & Title */}
                <div className="p-4 md:p-8 pb-4">
                    <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-500 mb-2">
                        <Link href="/admin/suppliers" className="hover:text-[var(--color-cashcrow-primary)] transition-colors">Suppliers</Link>
                        <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="text-[var(--color-cashcrow-primary)] font-medium truncate max-w-[150px]">{supplier.company_name}</span>
                    </nav>
                    <div className="flex items-start gap-3 md:gap-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-[var(--color-cashcrow-primary)]/10 flex items-center justify-center shrink-0">
                            <span className="text-[var(--color-cashcrow-primary)] font-bold text-lg md:text-xl">
                                {getInitials(supplier.company_name)}
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-xl md:text-3xl text-slate-900 dark:text-white tracking-tight font-bold truncate">{supplier.company_name}</h2>
                            <span className={`inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 rounded-md text-xs font-bold mt-1 md:mt-2 ${getCategoryColor(supplier.category)}`}>
                                {getCategoryLabel(supplier.category)}
                            </span>
                        </div>
                    </div>
                    
                    {/* Action Buttons - Stack on mobile */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3 mt-4 md:mt-6">
                        <Link 
                            href="/admin/add-suppliers"
                            className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                        >
                            <Pencil className="w-4 h-4" />
                            <span className="hidden sm:inline">Edit Supplier</span>
                            <span className="sm:hidden">Edit</span>
                        </Link>
                        <button 
                            onClick={() => generateSupplierPDF(supplier)}
                            className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-[var(--color-cashcrow-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-cashcrow-primary)]/90 transition-colors shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Download PDF</span>
                            <span className="sm:hidden">PDF</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <Mail className="w-4 h-4" />
                            <span className="hidden sm:inline">Contact Supplier</span>
                            <span className="sm:hidden">Contact</span>
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="px-4 md:px-8 pb-4 md:pb-8">
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                        {/* Contact Person */}
                        <div className="bg-white dark:bg-slate-900 p-3 md:p-6 rounded-lg md:rounded-xl border border-primary/5 shadow-sm">
                            <p className="text-slate-500 text-xs md:text-sm font-medium">Contact Person</p>
                            <div className="mt-1 md:mt-2">
                                <h3 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white truncate">{supplier.contact_name || 'Not specified'}</h3>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="bg-white dark:bg-slate-900 p-3 md:p-6 rounded-lg md:rounded-xl border border-primary/5 shadow-sm">
                            <p className="text-slate-500 text-xs md:text-sm font-medium">Email</p>
                            <div className="mt-1 md:mt-2">
                                <a href={`mailto:${supplier.email}`} className="text-[var(--color-cashcrow-primary)] text-xs md:text-sm font-semibold hover:underline truncate block">
                                    {supplier.email || 'N/A'}
                                </a>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="bg-white dark:bg-slate-900 p-3 md:p-6 rounded-lg md:rounded-xl border border-primary/5 shadow-sm">
                            <p className="text-slate-500 text-xs md:text-sm font-medium">Phone</p>
                            <div className="mt-1 md:mt-2">
                                <a href={`tel:${supplier.phone}`} className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300 truncate block">
                                    {supplier.phone || 'N/A'}
                                </a>
                            </div>
                        </div>

                        {/* Lead Time */}
                        <div className="bg-white dark:bg-slate-900 p-3 md:p-6 rounded-lg md:rounded-xl border border-primary/5 shadow-sm">
                            <p className="text-slate-500 text-xs md:text-sm font-medium">Lead Time</p>
                            <div className="flex items-baseline gap-1 md:gap-2 mt-1 md:mt-2">
                                <h3 className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white">{supplier.lead_time}</h3>
                                <span className="text-slate-400 text-xs md:text-sm">Days</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="px-4 md:px-8 pb-4 md:pb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
                        {/* Payment Terms */}
                        <div className="bg-white dark:bg-slate-900 p-3 md:p-6 rounded-lg md:rounded-xl border border-primary/5 shadow-sm">
                            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2 md:mb-4">
                                <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-cashcrow-primary)]" />
                                <span className="text-sm md:text-base">Payment Terms</span>
                            </h4>
                            <div className="p-2 md:p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <p className="text-sm md:text-lg font-semibold text-slate-900 dark:text-white">
                                    {getPaymentTermsLabel(supplier.payment_terms)}
                                </p>
                            </div>
                        </div>

                        {/* Website */}
                        <div className="bg-white dark:bg-slate-900 p-3 md:p-6 rounded-lg md:rounded-xl border border-primary/5 shadow-sm">
                            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2 md:mb-4">
                                <Globe className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-cashcrow-primary)]" />
                                <span className="text-sm md:text-base">Website</span>
                            </h4>
                            <div className="p-2 md:p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                {supplier.website ? (
                                    <a 
                                        href={supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[var(--color-cashcrow-primary)] text-xs md:text-sm font-semibold hover:underline truncate block"
                                    >
                                        {supplier.website}
                                    </a>
                                ) : (
                                    <p className="text-slate-400 text-sm">Not specified</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="px-4 md:px-8 pb-4 md:pb-8">
                    <div className="pt-4 md:pt-8 border-t border-red-100 dark:border-red-900/30">
                        <h4 className="text-red-600 font-bold flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="text-sm md:text-base">Danger Zone</span>
                        </h4>
                        <div className="dark:bg-red-900/10 p-3 md:p-4 rounded-lg md:rounded-xl border border-red-100 dark:border-red-900/30 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                            <div>
                                <p className="text-sm font-semibold text-red-900 dark:text-red-400">Delete Supplier</p>
                                <p className="text-xs text-red-700 dark:text-red-500/80">This action cannot be undone.</p>
                            </div>
                            <button className="px-4 md:px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm hover:shadow-lg whitespace-nowrap">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

