'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
    Search, 
    PlusCircle, 
    PackageOpen, 
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
    Minus
} from 'lucide-react'
import { jsPDF } from 'jspdf'

interface Product {
    id: string
    name: string
    sku: string
    category: string
    shelf_code: string
    box_code: string
    quantity: number
    min_stock_level: number
    notes: string
    image_url: string | null
    vendors: { fund?: string; link?: string; name?: string }[] | null
    initial_quantity: number
    unit_of_measurement: string | null
    created_at: string
    updated_at: string
}

interface PartsClientProps {
    products: Product[]
    totalCount: number
    currentPage: number
    totalPages: number
    userName: string
}

export default function PartsClient({ 
    products: initialProducts, 
    totalCount, 
    currentPage, 
    totalPages,
    userName 
}: PartsClientProps) {
    const [products] = useState<Product[]>(initialProducts)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    // Filter products based on search query
    const filteredProducts = useMemo(() => {
        if (!searchQuery) return products
        const query = searchQuery.toLowerCase()
        return products.filter(product => 
            product.name?.toLowerCase().includes(query) ||
            product.sku?.toLowerCase().includes(query) ||
            product.category?.toLowerCase().includes(query) ||
            product.shelf_code?.toLowerCase().includes(query) ||
            product.box_code?.toLowerCase().includes(query)
        )
    }, [products, searchQuery])

    // Get stock status
    const getStockStatus = (quantity: number, minLevel: number) => {
        if (quantity === 0) return { label: 'Out of Stock', color: 'red', bg: 'bg-red-100', text: 'text-red-700', ring: 'ring-red-200' }
        if (quantity <= minLevel) return { label: 'Low Stock', color: 'orange', bg: 'bg-orange-100', text: 'text-orange-700', ring: 'ring-orange-200' }
        return { label: 'In Stock', color: 'green', bg: 'bg-green-100', text: 'text-green-700', ring: 'ring-green-200' }
    }

    // Generate PDF for product details
    const generatePDF = (product: Product) => {
        const doc = new jsPDF()
        const stockStatus = getStockStatus(product.quantity || 0, product.min_stock_level || 0)
        
        // Header
        doc.setFillColor(38, 81, 54) // Primary color
        doc.rect(0, 0, 210, 40, 'F')
        
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(24)
        doc.setFont('helvetica', 'bold')
        doc.text('Part Details', 20, 25)
        
        // Reset text color
        doc.setTextColor(0, 0, 0)
        
        // Product Name
        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        doc.text(product.name || 'N/A', 20, 55)
        
        // SKU
        doc.setFontSize(12)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 100, 100)
        doc.text(`SKU: ${product.sku || 'N/A'}`, 20, 65)
        
        // Details Section
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('Product Information', 20, 85)
        
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        
        const details = [
            ['Category:', product.category || 'N/A'],
            ['Location:', `Shelf ${product.shelf_code || 'N/A'}, Box ${product.box_code || 'N/A'}`],
            ['Current Stock:', `${product.quantity || 0} ${product.unit_of_measurement || 'units'}`],
            ['Minimum Stock Level:', `${product.min_stock_level || 0} ${product.unit_of_measurement || 'units'}`],
            ['Stock Status:', stockStatus.label],
        ]
        
        let yPos = 95
        details.forEach(([label, value]) => {
            doc.setFont('helvetica', 'bold')
            doc.text(label, 20, yPos)
            doc.setFont('helvetica', 'normal')
            doc.text(value, 70, yPos)
            yPos += 8
        })
        
        // Notes Section
        if (product.notes) {
            doc.setFontSize(14)
            doc.setFont('helvetica', 'bold')
            doc.text('Notes', 20, yPos + 10)
            
            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            const splitNotes = doc.splitTextToSize(product.notes, 170)
            doc.text(splitNotes, 20, yPos + 20)
            yPos += 20 + (splitNotes.length * 5)
        }
        
        // Supplier Info Section
        if (product.vendors && product.vendors.length > 0) {
            doc.setFontSize(14)
            doc.setFont('helvetica', 'bold')
            doc.text('Supplier Information', 20, yPos + 15)
            
            doc.setFontSize(11)
            doc.setFont('helvetica', 'normal')
            doc.text('Primary Vendor:', 20, yPos + 25)
            doc.text(product.vendors[0]?.name || 'N/A', 70, yPos + 25)
            doc.text('Avg. Lead Time: 5-7 Business Days', 20, yPos + 33)
        }
        
        // Footer
        doc.setFontSize(9)
        doc.setTextColor(150, 150, 150)
        doc.text(`Generated on ${new Date().toLocaleDateString()} by Cashcrow Lab Inventory`, 20, 280)
        
        // Save the PDF
        doc.save(`${product.sku || 'product'}-details.pdf`)
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Parts Inventory</h2>
                    <p className="text-slate-500 font-medium mt-1">Manage and track your laboratory parts</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <input
                            type="text"
                            placeholder="Search parts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)]"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                    <Link href="/admin/add-product" className="shrink-0 flex items-center gap-2 bg-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-lightgreen)] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-colors">
                        <PlusCircle className="w-4 h-4" />
                        Add Part
                    </Link>
                </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.length === 0 ? (
                    <div className="col-span-full">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-inner mx-auto">
                                <PackageOpen className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">No parts found</h3>
                            <p className="text-slate-500 max-w-sm mb-6">
                                {searchQuery ? 'No parts match your search criteria.' : "You haven't added any parts to the inventory yet."}
                            </p>
                            {!searchQuery && (
                                <Link href="/admin/add-product" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors">
                                    <PlusCircle className="w-4 h-4" />
                                    Add First Part
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    filteredProducts.map(product => {
                        const stockStatus = getStockStatus(product.quantity || 0, product.min_stock_level || 0)
                        const stockPercentage = product.min_stock_level > 0 
                            ? Math.min(100, ((product.quantity || 0) / product.min_stock_level) * 100)
                            : 100

                        return (
                            <div 
                                key={product.id} 
                                className="bg-white rounded-xl border border-primary/5 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer"
                                onClick={() => setSelectedProduct(product)}
                            >
                                {/* Card Header */}
                                <div className="p-5 border-b border-slate-100">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <PackageOpen className="w-6 h-6 text-slate-400" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-[var(--color-cashcrow-primary)] transition-colors">
                                                    {product.name}
                                                </h3>
                                                <p className="text-xs font-medium text-slate-500 mt-0.5">{product.category}</p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${stockStatus.bg} ${stockStatus.text} ring-1 ${stockStatus.ring}`}>
                                            {stockStatus.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 space-y-4">
                                    {/* SKU */}
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-xs font-semibold border border-slate-200">
                                            {product.sku}
                                        </span>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-sm font-semibold text-slate-700">
                                            Shelf {product.shelf_code}, Box {product.box_code}
                                        </span>
                                    </div>

                                    {/* Stock Level */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-slate-500">Stock Level</span>
                                            <span className="text-xs font-bold text-slate-700">
                                                {product.quantity} / {product.min_stock_level}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${stockPercentage >= 100 ? 'bg-green-500' : stockPercentage >= 50 ? 'bg-orange-500' : 'bg-red-500'}`}
                                                style={{ width: `${Math.min(100, stockPercentage)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                    <button 
                                        className="text-xs font-bold text-[var(--color-cashcrow-primary)] hover:underline flex items-center gap-1"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            generatePDF(product)
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
                    })
                )}
            </div>

            {/* Pagination */}
            {filteredProducts.length > 0 && (
                <div className="mt-auto p-4 border-t border-slate-200 flex items-center justify-between bg-white rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Showing <span className="font-bold text-slate-800">{(currentPage - 1) * 6 + 1}</span> to <span className="font-bold text-slate-800">{Math.min(currentPage * 6, totalCount)}</span> of <span className="font-bold text-slate-800">{totalCount}</span> results
                    </p>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/admin/parts?page=${Math.max(1, currentPage - 1)}`}
                            className={`p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-600 transition-colors ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div className="hidden sm:flex items-center gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <Link
                                    key={i}
                                    href={`/admin/parts?page=${i + 1}`}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${currentPage === i + 1 ? 'bg-[var(--color-cashcrow-primary)] text-white' : 'hover:bg-slate-200 text-slate-600'}`}
                                >
                                    {i + 1}
                                </Link>
                            ))}
                        </div>
                        <Link
                            href={`/admin/parts?page=${Math.min(totalPages, currentPage + 1)}`}
                            className={`p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-600 transition-colors ${currentPage >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            )}

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setSelectedProduct(null)}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--color-cashcrow-bg-light)] dark:bg-[var(--color-cashcrow-bg-dark)] rounded-2xl shadow-2xl">
                        {/* Close Button */}
                        <button 
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-600 dark:text-slate-300 transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Breadcrumbs & Title */}
                        <div className="p-8 pb-4">
                            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                                <Link href="/admin/parts" className="hover:text-[var(--color-cashcrow-primary)] transition-colors">Parts</Link>
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-[var(--color-cashcrow-primary)] font-medium">{selectedProduct.name}</span>
                            </nav>
                            <h2 className="text-3xl text-slate-900 dark:text-white tracking-tight font-bold">{selectedProduct.name}</h2>
                            <p className="text-slate-500 font-mono text-sm mt-1">SKU: {selectedProduct.sku}</p>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 mt-4">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
                                    <FileText className="w-4 h-4" />
                                    Edit Part
                                </button>
                                <button 
                                    onClick={() => generatePDF(selectedProduct)}
                                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-cashcrow-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-cashcrow-primary)]/90 transition-colors shadow-sm"
                                >
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="px-8 pb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Current Stock */}
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/5 shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <p className="text-slate-500 text-sm font-medium">Current Stock</p>
                                        {(() => {
                                            const status = getStockStatus(selectedProduct.quantity || 0, selectedProduct.min_stock_level || 0)
                                            return (
                                                <span className={`px-2 py-0.5 ${status.bg} ${status.text} text-[10px] font-bold rounded uppercase tracking-wider ring-1 ${status.ring}`}>
                                                    {status.label}
                                                </span>
                                            )
                                        })()}
                                    </div>
                                    <div className="mt-2">
                                        <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white">{selectedProduct.quantity || 0}</h3>
                                        <p className="text-xs text-slate-500 mt-1">{selectedProduct.unit_of_measurement || 'Units'}</p>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] text-muted italic leading-tight">Stock calculated from ledger transactions.</p>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/5 shadow-sm">
                                    <p className="text-slate-500 text-sm font-medium">Location</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                            Shelf {selectedProduct.shelf_code}, Box {selectedProduct.box_code}
                                        </h3>
                                    </div>
                                    <button className="mt-4 text-[var(--color-cashcrow-primary)] text-xs font-semibold flex items-center gap-1 hover:underline">
                                        <MapPin className="w-3.5 h-3.5" />
                                        View on Floor Map
                                    </button>
                                </div>

                                {/* Min Stock Level */}
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/5 shadow-sm">
                                    <p className="text-slate-500 text-sm font-medium">Min. Stock Level</p>
                                    <div className="flex items-baseline gap-3 mt-2">
                                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{selectedProduct.min_stock_level || 0}</h3>
                                        <span className="text-slate-400 text-sm">Units</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                                        <div 
                                            className="bg-[var(--color-cashcrow-primary)] h-full"
                                            style={{ width: `${Math.min(100, ((selectedProduct.quantity || 0) / (selectedProduct.min_stock_level || 1)) * 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/5 shadow-sm">
                                    <p className="text-slate-500 text-sm font-medium">Category</p>
                                    <div className="mt-2">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedProduct.category}</h3>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-1">
                                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded uppercase">Hardware</span>
                                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded uppercase">Analog</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions & Supplier Info */}
                        <div className="px-8 pb-8">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                {/* Quick Actions */}
                                <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/5 shadow-sm space-y-4">
                                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                                        Quick Actions
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <button className="w-full flex items-center justify-start gap-3 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">
                                            <QrCode className="w-5 h-5 text-slate-400" />
                                            Print Label (QR)
                                        </button>
                                        <button className="w-full flex items-center justify-start gap-3 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">
                                            <BarChart3 className="w-5 h-5 text-slate-400" />
                                            View Analytics
                                        </button>
                                        <button className="w-full flex items-center justify-start gap-3 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">
                                            <Bell className="w-5 h-5 text-slate-400" />
                                            Manage Alerts
                                        </button>
                                    </div>
                                </div>

                                {/* Supplier Info */}
                                <div className="bg-[var(--color-cashcrow-primary)]/5 dark:bg-slate-900 p-6 rounded-xl border border-primary/10 shadow-sm">
                                    <h4 className="font-bold text-[var(--color-cashcrow-primary)] dark:text-[var(--color-cashcrow-primary)] mb-3 flex items-center gap-2">
                                        <Truck className="w-5 h-5" />
                                        Supplier Info
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Primary Vendor</p>
                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                {selectedProduct.vendors && selectedProduct.vendors.length > 0 
                                                    ? selectedProduct.vendors[0]?.name || 'Not specified'
                                                    : 'Not specified'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg. Lead Time</p>
                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">5-7 Business Days</p>
                                        </div>
                                        <button className="text-[var(--color-cashcrow-primary)] text-xs font-bold hover:underline">
                                            Contact Supplier
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes Section */}
                        {selectedProduct.notes && (
                            <div className="px-8 pb-8">
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/5 shadow-sm">
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-3">Notes</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedProduct.notes}</p>
                                </div>
                            </div>
                        )}

                        {/* Danger Zone */}
                        <div className="px-8 pb-8">
                            <div className="pt-8 border-t border-red-100 dark:border-red-900/30">
                                <h4 className="text-red-600 font-bold flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-5 h-5" />
                                    Danger Zone
                                </h4>
                                <div className="dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-red-900 dark:text-red-400">Archive Part</p>
                                        <p className="text-xs text-red-700 dark:text-red-500/80">Archiving will prevent future transactions for this part.</p>
                                    </div>
                                    <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm hover:shadow-lg">
                                        Archive Part
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

