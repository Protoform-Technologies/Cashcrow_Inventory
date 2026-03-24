'use client'

import { 
    Building2,
    Mail, 
    Calendar, 
    CreditCard, 
    Download,
    ChevronRight
} from 'lucide-react'
import { jsPDF } from 'jspdf'

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

interface SupplierCardProps {
    supplier: Supplier
    onClick: () => void
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

// Generate PDF function
export function generateSupplierPDF(supplier: Supplier) {
    const doc = new jsPDF()
    
    // Header
    doc.setFillColor(38, 81, 54) // Primary color
    doc.rect(0, 0, 210, 40, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('Supplier Details', 20, 25)
    
    // Reset text color
    doc.setTextColor(0, 0, 0)
    
    // Company Name
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(supplier.company_name || 'N/A', 20, 55)
    
    // Category
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text(`Category: ${getCategoryLabel(supplier.category) || 'N/A'}`, 20, 65)
    
    // Details Section
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Contact Information', 20, 85)
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    
    const details = [
        ['Contact Person:', supplier.contact_name || 'Not specified'],
        ['Email:', supplier.email || 'Not specified'],
        ['Phone:', supplier.phone || 'Not specified'],
        ['Website:', supplier.website || 'Not specified'],
    ]
    
    let yPos = 95
    details.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold')
        doc.text(label, 20, yPos)
        doc.setFont('helvetica', 'normal')
        doc.text(value, 70, yPos)
        yPos += 8
    })
    
    // Operational Information
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Operational Information', 20, yPos + 10)
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    
    const operationalDetails = [
        ['Lead Time:', `${supplier.lead_time} Days`],
        ['Payment Terms:', getPaymentTermsLabel(supplier.payment_terms)],
    ]
    
    yPos += 20
    operationalDetails.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold')
        doc.text(label, 20, yPos)
        doc.setFont('helvetica', 'normal')
        doc.text(value, 70, yPos)
        yPos += 8
    })
    
    // Footer
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    doc.text(`Generated on ${new Date().toLocaleDateString()} by Cashcrow Lab Inventory`, 20, 280)
    
    // Save the PDF
    doc.save(`${supplier.company_name?.replace(/\s+/g, '-').toLowerCase() || 'supplier'}-details.pdf`)
}

export default function SupplierCard({ supplier, onClick }: SupplierCardProps) {
    return (
        <div 
            className="bg-white rounded-xl border border-primary/5 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer"
            onClick={onClick}
        >
            {/* Card Header */}
            <div className="p-5 border-b border-slate-100">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-[var(--color-cashcrow-primary)]/10 flex items-center justify-center shrink-0">
                            <span className="text-[var(--color-cashcrow-primary)] font-bold text-sm">
                                {getInitials(supplier.company_name)}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-[var(--color-cashcrow-primary)] transition-colors">
                                {supplier.company_name}
                            </h3>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">{supplier.contact_name || 'No contact'}</p>
                        </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${getCategoryColor(supplier.category)}`}>
                        {getCategoryLabel(supplier.category)}
                    </span>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-5 space-y-4">
                {/* Email */}
                <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm text-slate-600 truncate">
                        {supplier.email || 'No email'}
                    </span>
                </div>

                {/* Lead Time */}
                <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700">
                        {supplier.lead_time} Days Lead Time
                    </span>
                </div>

                {/* Payment Terms */}
                <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700">
                        {getPaymentTermsLabel(supplier.payment_terms)}
                    </span>
                </div>
            </div>

            {/* Card Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button 
                    className="text-xs font-bold text-[var(--color-cashcrow-primary)] hover:underline flex items-center gap-1"
                    onClick={(e) => {
                        e.stopPropagation()
                        generateSupplierPDF(supplier)
                    }}
                >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                </button>
                <span className="text-xs text-slate-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Details
                    <ChevronRight className="w-3.5 h-3.5" />
                </span>
            </div>
        </div>
    )
}

