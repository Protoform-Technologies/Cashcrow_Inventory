'use client'

import { useRouter } from 'next/navigation'
import {
    Building2,
    Mail,
    Download,
    ChevronRight,
    Tag
} from 'lucide-react'
import { jsPDF } from 'jspdf'
import { addReportHeader, drawSectionTitle, drawTable, ensureSpace } from '@/lib/pdf'
import { getSupplierProducts } from '@/actions/suppliers'

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

interface SupplierCardProps {
    supplier: Supplier
}

function getLeadTimeStatus(days: number) {
    if (days <= 5) return { label: 'Fast Delivery', color: 'emerald', bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-200' }
    if (days <= 10) return { label: 'Standard', color: 'blue', bg: 'bg-blue-100', text: 'text-blue-700', ring: 'ring-blue-200' }
    return { label: 'Slow Turnaround', color: 'orange', bg: 'bg-orange-100', text: 'text-orange-700', ring: 'ring-orange-200' }
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

function getInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

// Supplier report — same branded, green-table style as the Part report.
export async function generateSupplierPDF(supplier: Supplier) {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const marginX = 20
    const contentW = pageWidth - marginX * 2

    // Products this supplier provides (matched from product vendor lists).
    const products = await getSupplierProducts(supplier.company_name)

    // Branded header (logo + timestamp)
    let y = await addReportHeader(doc, { pageWidth, marginX })

    // Supplier name + category
    y += 12
    doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.setTextColor(20, 20, 20)
    doc.text(supplier.company_name || 'Supplier', marginX, y)
    y += 7
    doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(120, 120, 120)
    doc.text(`Category: ${getCategoryLabel(supplier.category) || 'N/A'}`, marginX, y)

    const cols: [number, number] = [contentW * 0.4, contentW * 0.6]

    // Overview
    y += 12
    y = drawSectionTitle(doc, 'OVERVIEW', marginX, y)
    y = drawTable(doc, {
        startY: y,
        head: ['Field', 'Value'],
        rows: [
            ['Category', getCategoryLabel(supplier.category) || 'N/A'],
            ['Lead Time', `${supplier.lead_time || 0} days`],
            ['Payment Terms', getPaymentTermsLabel(supplier.payment_terms) || 'N/A'],
        ],
        colWidths: cols,
        marginX,
    })

    // Contact
    y = ensureSpace(doc, y + 12, 30)
    y = drawSectionTitle(doc, 'CONTACT', marginX, y)
    y = drawTable(doc, {
        startY: y,
        head: ['Field', 'Value'],
        rows: [
            ['Contact Person', supplier.contact_name || 'Not specified'],
            ['Email', supplier.email || 'Not specified'],
            ['Phone', supplier.phone || 'Not specified'],
            ['Website', supplier.website || 'Not specified'],
        ],
        colWidths: cols,
        marginX,
    })

    // Bank & tax
    y = ensureSpace(doc, y + 12, 30)
    y = drawSectionTitle(doc, 'BANK & TAX', marginX, y)
    y = drawTable(doc, {
        startY: y,
        head: ['Field', 'Value'],
        rows: [
            ['GST No', supplier.gst_no || 'Not specified'],
            ['Bank Account', supplier.bank_account || 'Not specified'],
            ['IFSC', supplier.ifsc || 'Not specified'],
            ['Branch', supplier.branch || 'Not specified'],
            ['Payment ID', supplier.payment_id || 'Not specified'],
        ],
        colWidths: cols,
        marginX,
    })

    // Products supplied (name / SKU / qty / status — no image)
    y = ensureSpace(doc, y + 12, 30)
    y = drawSectionTitle(doc, 'PRODUCTS SUPPLIED', marginX, y)
    if (products.length) {
        y = drawTable(doc, {
            startY: y,
            head: ['Product', 'SKU', 'Qty', 'Status'],
            rows: products.map(p => [p.name, p.sku, p.quantity, p.status]),
            colWidths: [contentW * 0.42, contentW * 0.23, contentW * 0.13, contentW * 0.22],
            marginX,
        })
    } else {
        doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(120, 120, 120)
        doc.text('No products linked to this supplier.', marginX, y + 6)
    }

    doc.save(`${supplier.company_name?.replace(/\s+/g, '-').toLowerCase() || 'supplier'}-details.pdf`)
}

export default function SupplierCard({ supplier }: SupplierCardProps) {
    const router = useRouter()
    const status = getLeadTimeStatus(supplier.lead_time || 0)
    const leadTimePercentage = Math.min(100, ((supplier.lead_time || 7) / 14) * 100)

    return (
        <div
            onClick={() => router.push(`/admin/suppliers/${supplier.id}`)}
            role="button"
            tabIndex={0}
            className="bg-white rounded-xl border border-[var(--color-cashcrow-textmuted)]/20 shadow-sm transition-all overflow-hidden group cursor-pointer flex flex-col h-full text-left hover:shadow-md hover:border-[var(--color-cashcrow-primary)]/30"
        >
            {/* Card Header */}
            <div className="p-4 border-b border-slate-100">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-[var(--color-cashcrow-primary)] transition-colors break-words line-clamp-2">
                                {supplier.company_name}
                            </h3>
                            <p className="text-[11px] font-medium text-slate-500 mt-0.5 line-clamp-1">{supplier.contact_name || 'No Contact'}</p>
                        </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold shrink-0 ${status.bg} ${status.text} ring-1 ${status.ring}`}>
                        {status.label}
                    </span>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3 flex-1">
                {/* Category Mono-Tag */}
                <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-xs font-semibold border border-slate-200 uppercase tracking-widest">
                        {getCategoryLabel(supplier.category)}
                    </span>
                </div>

                {/* Email */}
                <div className="flex items-start gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                    <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${supplier.email}&su=Inquiry from Cashcrow Inventory`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-slate-600 font-medium break-all hover:text-[var(--color-cashcrow-primary)] hover:underline transition-colors"
                    >
                        {supplier.email || 'No email'}
                    </a>
                </div>

                {/* Lead Time Metrics */}
                <div className="space-y-2 mt-auto pt-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">Lead Time</span>
                        <span className="text-xs font-bold text-slate-700">
                            {supplier.lead_time} Days
                        </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-500 ${
                                status.color === 'emerald' ? 'bg-emerald-500' : 
                                status.color === 'blue' ? 'bg-blue-500' : 
                                'bg-orange-500'
                            }`}
                            style={{ width: `${leadTimePercentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Card Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between mt-auto">
                <button
                    className="text-xs font-bold text-[var(--color-cashcrow-primary)] hover:underline flex items-center gap-1.5"
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        generateSupplierPDF(supplier)
                    }}
                >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                </button>
                <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                    View Details
                    <ChevronRight className="w-3.5 h-3.5" />
                </span>
            </div>
        </div>
    )
}

