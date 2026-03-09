'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
    Search, 
    PlusCircle, 
    Building2, 
    ArrowLeft, 
    ArrowRight,
    FileText,
    MapPin,
    AlertTriangle,
    Tag,
    Box,
    BarChart3,
    QrCode,
    Bell,
    Truck,
    X,
    Download,
    ChevronRight,
    TrendingUp,
    TrendingDown,
    Minus,
    Mail,
    Phone,
    Globe,
    Calendar,
    CreditCard,
    Pencil,
    Trash2,
    Loader2
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

interface SuppliersClientProps {
    suppliers: Supplier[]
    totalCount: number
    currentPage: number
    totalPages: number
    userName: string
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

export default function SuppliersClient({ 
    suppliers: initialSuppliers, 
    totalCount, 
    currentPage, 
    totalPages,
    userName 
}: SuppliersClientProps) {
    const [suppliers] = useState<Supplier[]>(initialSuppliers)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

    // Filter suppliers based on search query
    const filteredSuppliers = useMemo(() => {
        if (!searchQuery) return suppliers
        const query = searchQuery.toLowerCase()
        return suppliers.filter(supplier => 
            supplier.company_name?.toLowerCase().includes(query) ||
            supplier.contact_name?.toLowerCase().includes(query) ||
            supplier.email?.toLowerCase().includes(query) ||
            supplier.category?.toLowerCase().includes(query)
        )
    }, [suppliers, searchQuery])

    // Calculate average lead time
    const averageLeadTime = useMemo(() => {
        if (suppliers.length === 0) return 0
        const total = suppliers.reduce((acc, s) => acc + (s.lead_time || 0), 0)
        return Math.round(total / suppliers.length * 10) / 10
    }, [suppliers])

    // Active suppliers count
    const activeSuppliers = totalCount // Assuming all suppliers in DB are active

    // Generate PDF for supplier details
    const generatePDF = (supplier: Supplier) => {
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

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Suppliers</h2>
                    <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Manage and track your inventory source partners</p>
                </div>
                <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none sm:w-64">
                        <input
                            type="text"
                            placeholder="Search suppliers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-2 rounded-lg md:rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] text-sm"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <Link href="/admin/add-suppliers" className="shrink-0 flex items-center gap-1.5 md:gap-2 bg-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-lightgreen)] text-white px-3 md:px-4 py-2 rounded-lg md:rounded-xl font-bold text-sm shadow-md transition-colors whitespace-nowrap">
                        <PlusCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Supplier</span>
                        <span className="sm:hidden">Add</span>
                    </Link>
                </div>
            </div>

            {/* Supplier Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSuppliers.length === 0 ? (
                    <div className="col-span-full">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-inner mx-auto">
                                <Building2 className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">No suppliers found</h3>
                            <p className="text-slate-500 max-w-sm mb-6">
                                {searchQuery ? 'No suppliers match your search criteria.' : "You haven't added any suppliers yet."}
                            </p>
                            {!searchQuery && (
                                <Link href="/admin/add-suppliers" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors">
                                    <PlusCircle className="w-4 h-4" />
                                    Add First Supplier
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    filteredSuppliers.map(supplier => (
                        <div 
                            key={supplier.id} 
                            className="bg-white rounded-xl border border-primary/5 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer"
                            onClick={() => setSelectedSupplier(supplier)}
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
                                        generatePDF(supplier)
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
                    ))
                )}
            </div>

            {/* Pagination */}
            {filteredSuppliers.length > 0 && (
                <div className="mt-auto p-4 border-t border-slate-200 flex items-center justify-between bg-white rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Showing <span className="font-bold text-slate-800">{(currentPage - 1) * 6 + 1}</span> to <span className="font-bold text-slate-800">{Math.min(currentPage * 6, totalCount)}</span> of <span className="font-bold text-slate-800">{totalCount}</span> results
                    </p>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/admin/suppliers?page=${Math.max(1, currentPage - 1)}`}
                            className={`p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-600 transition-colors ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div className="hidden sm:flex items-center gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <Link
                                    key={i}
                                    href={`/admin/suppliers?page=${i + 1}`}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${currentPage === i + 1 ? 'bg-[var(--color-cashcrow-primary)] text-white' : 'hover:bg-slate-200 text-slate-600'}`}
                                >
                                    {i + 1}
                                </Link>
                            ))}
                        </div>
                        <Link
                            href={`/admin/suppliers?page=${Math.min(totalPages, currentPage + 1)}`}
                            className={`p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-600 transition-colors ${currentPage >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl border border-primary/5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-[var(--color-cashcrow-primary)]/10 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Total Suppliers</p>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900">{totalCount}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-primary/5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <Truck className="w-5 h-5 text-green-600" />
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Active Partners</p>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900">{activeSuppliers}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-primary/5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Avg. Lead Time</p>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900">{averageLeadTime} Days</h3>
                </div>
            </div>

            {/* Supplier Detail Modal */}
            {selectedSupplier && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setSelectedSupplier(null)}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--color-cashcrow-bg-light)] dark:bg-[var(--color-cashcrow-bg-dark)] rounded-xl md:rounded-2xl shadow-2xl mx-2">
                        {/* Close Button */}
                        <button 
                            onClick={() => setSelectedSupplier(null)}
                            className="absolute top-3 right-3 md:top-4 md:right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-600 dark:text-slate-300 transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Breadcrumbs & Title */}
                        <div className="p-4 md:p-8 pb-4">
                            <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-500 mb-2">
                                <Link href="/admin/suppliers" className="hover:text-[var(--color-cashcrow-primary)] transition-colors">Suppliers</Link>
                                <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                                <span className="text-[var(--color-cashcrow-primary)] font-medium truncate max-w-[150px]">{selectedSupplier.company_name}</span>
                            </nav>
                            <div className="flex items-start gap-3 md:gap-4">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-[var(--color-cashcrow-primary)]/10 flex items-center justify-center shrink-0">
                                    <span className="text-[var(--color-cashcrow-primary)] font-bold text-lg md:text-xl">
                                        {getInitials(selectedSupplier.company_name)}
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-xl md:text-3xl text-slate-900 dark:text-white tracking-tight font-bold truncate">{selectedSupplier.company_name}</h2>
                                    <span className={`inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 rounded-md text-xs font-bold mt-1 md:mt-2 ${getCategoryColor(selectedSupplier.category)}`}>
                                        {getCategoryLabel(selectedSupplier.category)}
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
                                    onClick={() => generatePDF(selectedSupplier)}
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
                                        <h3 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white truncate">{selectedSupplier.contact_name || 'Not specified'}</h3>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="bg-white dark:bg-slate-900 p-3 md:p-6 rounded-lg md:rounded-xl border border-primary/5 shadow-sm">
                                    <p className="text-slate-500 text-xs md:text-sm font-medium">Email</p>
                                    <div className="mt-1 md:mt-2">
                                        <a href={`mailto:${selectedSupplier.email}`} className="text-[var(--color-cashcrow-primary)] text-xs md:text-sm font-semibold hover:underline truncate block">
                                            {selectedSupplier.email || 'N/A'}
                                        </a>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="bg-white dark:bg-slate-900 p-3 md:p-6 rounded-lg md:rounded-xl border border-primary/5 shadow-sm">
                                    <p className="text-slate-500 text-xs md:text-sm font-medium">Phone</p>
                                    <div className="mt-1 md:mt-2">
                                        <a href={`tel:${selectedSupplier.phone}`} className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300 truncate block">
                                            {selectedSupplier.phone || 'N/A'}
                                        </a>
                                    </div>
                                </div>

                                {/* Lead Time */}
                                <div className="bg-white dark:bg-slate-900 p-3 md:p-6 rounded-lg md:rounded-xl border border-primary/5 shadow-sm">
                                    <p className="text-slate-500 text-xs md:text-sm font-medium">Lead Time</p>
                                    <div className="flex items-baseline gap-1 md:gap-2 mt-1 md:mt-2">
                                        <h3 className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white">{selectedSupplier.lead_time}</h3>
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
                                            {getPaymentTermsLabel(selectedSupplier.payment_terms)}
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
                                        {selectedSupplier.website ? (
                                            <a 
                                                href={selectedSupplier.website.startsWith('http') ? selectedSupplier.website : `https://${selectedSupplier.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[var(--color-cashcrow-primary)] text-xs md:text-sm font-semibold hover:underline truncate block"
                                            >
                                                {selectedSupplier.website}
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
            )}
        </div>
    )
}

