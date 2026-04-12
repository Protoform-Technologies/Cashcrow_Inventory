import { 
    Building2,
    Mail, 
    Calendar, 
    CreditCard, 
    Download,
    ChevronRight,
    Phone,
    Globe,
    Tag
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
    gst_no: string | null
    bank_account: string | null
    ifsc: string | null
    branch: string | null
    payment_id: string | null
    created_at: string
}

interface SupplierCardProps {
    supplier: Supplier
    onClick: () => void
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

// Generate PDF function (Keeping it the same but ensuring consistency)
export function generateSupplierPDF(supplier: Supplier) {
    const doc = new jsPDF()
    doc.setFillColor(38, 81, 54) 
    doc.rect(0, 0, 210, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('Supplier Details', 20, 25)
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(supplier.company_name || 'N/A', 20, 55)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text(`Category: ${getCategoryLabel(supplier.category) || 'N/A'}`, 20, 65)
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
    doc.save(`${supplier.company_name?.replace(/\s+/g, '-').toLowerCase() || 'supplier'}-details.pdf`)
}

export default function SupplierCard({ supplier, onClick }: SupplierCardProps) {
    const status = getLeadTimeStatus(supplier.lead_time || 0)
    const leadTimePercentage = Math.min(100, ((supplier.lead_time || 7) / 14) * 100)

    return (
        <div 
            className="bg-white rounded-xl border border-[var(--color-cashcrow-textmuted)]/20 shadow-sm transition-all overflow-hidden group cursor-pointer flex flex-col h-full"
            onClick={onClick}
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

