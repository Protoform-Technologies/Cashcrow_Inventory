'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
    X,
    ChevronRight,
    Pencil,
    Download,
    Mail,
    Phone,
    Globe,
    CreditCard,
    AlertTriangle,
    Copy,
    Check,
    Loader2,
    User,
    Clock
} from 'lucide-react'
import { deleteSupplier } from '@/actions/suppliers'
import { useRouter } from 'next/navigation'
import EditSupplierForm from './edit-supplier-form'
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
    gst_no: string | null
    bank_account: string | null
    ifsc: string | null
    branch: string | null
    payment_id: string | null
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

// Logistics Logic: Categorize lead times based on days
function getLeadTimeStatus(days: number) {
    if (days <= 5) return { label: 'Fast Delivery', bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-200' }
    if (days <= 10) return { label: 'Standard', bg: 'bg-blue-100', text: 'text-blue-700', ring: 'ring-blue-200' }
    return { label: 'Slow Turnaround', bg: 'bg-orange-100', text: 'text-orange-700', ring: 'ring-orange-200' }
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
        'logistics': 'bg-blue-100 text-blue-700',
        'manufacturing': 'bg-purple-100 text-purple-700',
        'it_services': 'bg-cyan-100 text-cyan-700',
        'office_supplies': 'bg-slate-100 text-slate-700',
        'electronics': 'bg-amber-100 text-amber-700',
        'other': 'bg-slate-100 text-slate-700'
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
    const router = useRouter()
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [copiedField, setCopiedField] = useState<string | null>(null)

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 2000)
    }

    const CopyButton = ({ text, field }: { text: string, field: string }) => (
        <button
            onClick={() => copyToClipboard(text, field)}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
            title="Copy to clipboard"
        >
            {copiedField === field ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
        </button>
    )

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />


            {/* Modal Content */}
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--color-cashcrow-bg-light)] rounded-xl md:rounded-2xl shadow-2xl mx-2">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 md:top-4 md:right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-600 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Breadcrumbs & Title */}
                <div className="p-4 md:p-8 pb-4">
                    <div className="flex items-start gap-3 md:gap-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-[var(--color-cashcrow-primary)]/10 flex items-center justify-center shrink-0">
                            <span className="text-[var(--color-cashcrow-primary)] font-bold text-lg md:text-xl">
                                {getInitials(supplier.company_name)}
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-xl md:text-3xl text-slate-900 tracking-tight font-bold break-words leading-tight">{supplier.company_name}</h2>
                            <span className={`inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 rounded-md text-xs font-bold mt-1 md:mt-2 ${getCategoryColor(supplier.category)}`}>
                                {getCategoryLabel(supplier.category)}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons - Stack on mobile */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-3 mt-4 md:mt-6">
                        <button
                            onClick={() => {
                                setEditingSupplier(supplier)
                                setShowEditModal(true)
                            }}
                            className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-[var(--color-cashcrow-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-cashcrow-primary)]/90 transition-colors shadow-sm"

                        >
                            <Pencil className="w-4 h-4" />
                            <span className="hidden sm:inline">Edit Supplier</span>
                            <span className="sm:hidden">Edit</span>
                        </button>
                        <button
                            onClick={() => generateSupplierPDF(supplier)}
                            className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-[var(--color-cashcrow-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-cashcrow-primary)]/90 transition-colors shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Download PDF</span>
                            <span className="sm:hidden">PDF</span>
                        </button>
                        {supplier.email ? (
                            <a
                                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${supplier.email}&su=Inquiry from Cashcrow Inventory`}
                                className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-[#265136] text-white rounded-lg text-sm font-semibold hover:bg-[#1f422b] transition-colors shadow-sm"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Mail className="w-4 h-4" />
                                <span className="hidden sm:inline">Email Supplier</span>
                                <span className="sm:hidden">Email</span>
                            </a>
                        ) : supplier.phone ? (
                            <a
                                href={`tel:${supplier.phone}`}
                                className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors" target="_blank" rel="noopener noreferrer"

                            >
                                <Phone className="w-4 h-4" />
                                <span className="hidden sm:inline">Call Supplier</span>
                                <span className="sm:hidden">Call</span>
                            </a>
                        ) : (
                            <button className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-slate-100 text-slate-400 rounded-lg text-sm font-semibold cursor-not-allowed opacity-50">
                                <Mail className="w-4 h-4" />
                                No Contact Info
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="px-4 md:px-8 pb-4 md:pb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4">
                        {/* Contact Person */}
                        <div className="bg-white p-3 md:p-6 rounded-lg md:rounded-xl border border-primary/5 shadow-sm">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2 md:mb-4">
                                <User className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-cashcrow-primary)]" />
                                <span className="text-sm md:text-base">Contact Person</span>
                            </h4>
                            <div className="p-2 md:p-4 bg-slate-50 rounded-lg">
                                <p className="text-sm md:text-lg font-semibold text-slate-900 break-words">
                                    {supplier.contact_name || 'Not specified'}
                                </p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="bg-white p-3 md:p-6 rounded-lg md:rounded-xl border border-primary/5 shadow-sm">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2 md:mb-4">
                                <Mail className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-cashcrow-primary)]" />
                                <span className="text-sm md:text-base">Email</span>
                            </h4>
                            <div className="p-2 md:p-4 bg-slate-50 rounded-lg">
                                <a href={`mailto:${supplier.email}`} className="text-[var(--color-cashcrow-primary)] text-sm md:text-lg font-semibold hover:underline break-all block">
                                    {supplier.email || 'N/A'}
                                </a>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="bg-white p-3 md:p-6 rounded-lg md:rounded-xl border border-primary/5 shadow-sm">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2 md:mb-4">
                                <Phone className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-cashcrow-primary)]" />
                                <span className="text-sm md:text-base">Phone</span>
                            </h4>
                            <div className="p-2 md:p-4 bg-slate-50 rounded-lg">
                                <a href={`tel:${supplier.phone}`} className="text-sm md:text-lg font-semibold text-slate-700 break-all block">
                                    {supplier.phone || 'N/A'}
                                </a>
                            </div>
                        </div>

                        {/* Lead Time */}
                        <div className="bg-white p-3 md:p-6 rounded-lg md:rounded-xl border border-primary/5 shadow-sm">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2 md:mb-4">
                                <Clock className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-cashcrow-primary)]" />
                                <span className="text-sm md:text-base">Lead Time</span>
                            </h4>
                            <div className="p-2 md:p-4 bg-slate-50 rounded-lg flex items-center justify-between">
                                <div className="flex items-baseline gap-1 md:gap-2">
                                    <h3 className="text-sm md:text-lg font-bold text-slate-900">{supplier.lead_time}</h3>
                                    <span className="text-slate-400 text-xs md:text-sm">Days</span>
                                </div>
                                {(() => {
                                    const status = getLeadTimeStatus(supplier.lead_time)
                                    return (
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.text} ring-1 ${status.ring}`}>
                                            {status.label}
                                        </span>
                                    )
                                })()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="px-4 md:px-8 pb-4 md:pb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
                        {/* Payment Terms */}
                        <div className="bg-white p-3 md:p-6 rounded-lg md:rounded-xl border border-primary/5 shadow-sm">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2 md:mb-4">
                                <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-cashcrow-primary)]" />
                                <span className="text-sm md:text-base">Payment Terms</span>
                            </h4>
                            <div className="p-2 md:p-4 bg-slate-50 rounded-lg">
                                <p className="text-sm md:text-lg font-semibold text-slate-900">
                                    {getPaymentTermsLabel(supplier.payment_terms)}
                                </p>
                            </div>
                        </div>

                        {/* Website */}
                        <div className="bg-white p-3 md:p-6 rounded-lg md:rounded-xl border border-primary/5 shadow-sm">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2 md:mb-4">
                                <Globe className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-cashcrow-primary)]" />
                                <span className="text-sm md:text-base">Website</span>
                            </h4>
                            <div className="p-2 md:p-4 bg-slate-50 rounded-lg">
                                {supplier.website ? (
                                    <a
                                        href={supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[var(--color-cashcrow-primary)] text-xs md:text-sm font-semibold hover:underline break-all block"
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

                {/* Billing Information */}
                {supplier.gst_no || supplier.bank_account || supplier.ifsc || supplier.branch ? (
                    <div className="px-4 md:px-8 pb-4 md:pb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white p-3 md:p-6 rounded-lg md:rounded-xl border border-primary/5 shadow-sm">
                                <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                                    <CreditCard className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                                    <span>Billing Details</span>
                                </h4>
                                <div className="space-y-3">
                                    {supplier.gst_no && (
                                        <div>
                                            <span className="text-xs text-slate-500">GST No</span>
                                            <div className="flex items-center gap-2">
                                                <p className="font-mono text-sm font-semibold text-slate-900">{supplier.gst_no}</p>
                                                <CopyButton text={supplier.gst_no} field="gst_no" />
                                            </div>
                                        </div>
                                    )}
                                    {supplier.payment_id && (
                                        <div>
                                            <span className="text-xs text-slate-500">GPay ID / Payment Mobile</span>
                                            <div className="flex items-center gap-2">
                                                <p className="font-mono text-sm font-semibold text-slate-900">{supplier.payment_id}</p>
                                                <CopyButton text={supplier.payment_id} field="payment_id" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white p-3 md:p-6 rounded-lg md:rounded-xl border border-primary/5 shadow-sm">
                                <div className="space-y-3">
                                    {supplier.bank_account && (
                                        <div>
                                            <span className="text-xs text-slate-500">Bank Account</span>
                                            <div className="flex items-center gap-2">
                                                <p className="font-mono text-sm font-semibold text-slate-900">{supplier.bank_account}</p>
                                                <CopyButton text={supplier.bank_account} field="bank_account" />
                                            </div>
                                        </div>
                                    )}
                                    {supplier.ifsc && (
                                        <div>
                                            <span className="text-xs text-slate-500">IFSC</span>
                                            <div className="flex items-center gap-2">
                                                <p className="font-mono text-sm font-semibold text-slate-900">{supplier.ifsc}</p>
                                                <CopyButton text={supplier.ifsc} field="ifsc" />
                                            </div>
                                        </div>
                                    )}
                                    {supplier.branch && (
                                        <div>
                                            <span className="text-xs text-slate-500">Branch</span>
                                            <p className="text-sm font-semibold text-slate-900">{supplier.branch}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="px-4 md:px-8 pb-4 md:pb-8">
                        <div className="bg-slate-50 p-8 rounded-xl text-center border-2 border-dashed border-slate-200">
                            <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                            <h4 className="text-slate-500 font-medium mb-1">No billing information</h4>
                            <p className="text-sm text-slate-400">Add billing details via edit supplier</p>
                        </div>
                    </div>
                )}

                {/* Danger Zone */}
                <div className="px-4 md:px-8 pb-4 md:pb-8">
                    <div className="pt-4 md:pt-8 border-t border-red-100">
                        <h4 className="text-red-600 font-bold flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="text-sm md:text-base">Danger Zone</span>
                        </h4>
                        <div className=" p-3 md:p-4 rounded-lg md:rounded-xl border border-red-100 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                            <div>
                                <p className="text-sm font-semibold text-red-900">Delete Supplier</p>
                                <p className="text-xs text-red-700">This action cannot be undone.</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="px-4 md:px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm hover:shadow-lg whitespace-nowrap"
                                >
                                    Delete Supplier
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isDeleting && setShowDeleteConfirm(false)} />
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300 relative z-10">
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <AlertTriangle className="w-10 h-10 text-red-600 animate-pulse" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Are you sure?</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                You are about to permanently delete <span className="font-bold text-slate-900">{supplier.company_name}</span>. This action cannot be reversed.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={isDeleting}
                                    className="flex-1 px-6 py-3.5 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all hover:border-slate-300 disabled:opacity-50"
                                >
                                    No, Keep it
                                </button>
                                <button
                                    onClick={async () => {
                                        setIsDeleting(true)
                                        const result = await deleteSupplier(supplier.id)
                                        if (result.success) {
                                            setShowDeleteConfirm(false)
                                            onClose()
                                            router.refresh()
                                        } else {
                                            setIsDeleting(false)
                                            console.error('Delete failed:', result.error)
                                        }
                                    }}
                                    disabled={isDeleting}
                                    className="flex-1 px-6 py-3.5 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        'Yes, Delete'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Supplier Modal */}
            {showEditModal && editingSupplier && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Edit Supplier</h3>
                                <p className="text-slate-500 text-sm mt-1">Update supplier information</p>
                            </div>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <div className="p-6">
                            <EditSupplierForm
                                supplier={editingSupplier}
                                onSuccess={() => {
                                    setShowEditModal(false)
                                    setEditingSupplier(null)
                                    router.refresh()
                                }}
                                onCancel={() => {
                                    setShowEditModal(false)
                                    setEditingSupplier(null)
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

