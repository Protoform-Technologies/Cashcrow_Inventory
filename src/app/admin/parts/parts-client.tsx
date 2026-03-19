'use client'

import { useState, useMemo, useEffect } from 'react'
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
    Minus,
    Edit3,
    Loader2,
    RefreshCw
} from 'lucide-react'
import { jsPDF } from 'jspdf'
import { deleteProduct, updateProduct } from '@/actions/products'
import EditProductForm from '@/components/dashboard/edit-product-form'
import { getProductRecentLogs } from '@/actions/day-logs'
import { useRouter } from 'next/navigation'

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
// Fetch recent logs for selected product - consolidated

    const getStockStatus = (quantity: number, minLevel: number) => {
        if (quantity === 0) return { label: 'Out of Stock', color: 'red', bg: 'bg-red-100', text: 'text-red-700', ring: 'ring-red-200' }
        if (quantity <= minLevel) return { label: 'Low Stock', color: 'orange', bg: 'bg-orange-100', text: 'text-orange-700', ring: 'ring-orange-200' }
        return { label: 'In Stock', color: 'green', bg: 'bg-green-100', text: 'text-green-700', ring: 'ring-green-200' }
    }

// States
    const [showEditModal, setShowEditModal] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
    const [deleteError, setDeleteError] = useState('')
    const [recentLogs, setRecentLogs] = useState<any[]>([])
    const [loadingLogs, setLoadingLogs] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)
    const router = useRouter()

    // Consolidated refreshLogs function
    const refreshLogs = async () => {
        if (!selectedProduct) return
        setLoadingLogs(true)
        try {
            const result = await getProductRecentLogs(selectedProduct.id)
            setRecentLogs(Array.isArray(result) ? result : result.logs || [])
        } catch (error) {
            console.error('Error fetching logs:', error)
            setRecentLogs([])
        } finally {
            setLoadingLogs(false)
        }
    }

    useEffect(() => {
        refreshLogs()
    }, [selectedProduct?.id, refreshKey])

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
                                        // generatePDF(product) // TODO: implement PDF generation
                                        console.log('PDF download for', product)
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
                        Showing <span className="font-bold text-slate-800">{(currentPage - 1) * 9 + 1}</span> to <span className="font-bold text-slate-800">{Math.min(currentPage * 9, totalCount)}</span> of <span className="font-bold text-slate-800">{totalCount}</span> results
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
                    <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--color-cashcrow-bg-light)] rounded-2xl shadow-2xl">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-600 transition-colors z-10"
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
                            <h2 className="text-3xl text-slate-900 tracking-tight font-bold">{selectedProduct.name}</h2>
                            <p className="text-slate-500 font-mono text-sm mt-1">SKU: {selectedProduct.sku}</p>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 mt-4">
                                <button onClick={(e) => {
                                    e.stopPropagation()
                                    setShowEditModal(true)
                                }} className="flex items-center gap-2 px-4 py-2 bg-[var(--color-cashcrow-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-cashcrow-lightgreen)] transition-colors shadow-sm">
                                    <Edit3 className="w-4 h-4" />
                                    Edit Part
                                </button>
                                <button
                                        onClick={() => {
                                            // generatePDF(selectedProduct) // TODO: implement PDF generation
                                            console.log('PDF download for', selectedProduct)
                                        }}
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
                                <div className="bg-white p-6 rounded-xl border border-primary/5 shadow-sm">
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
                                        <h3 className="text-4xl font-extrabold text-slate-900">{selectedProduct.quantity || 0}</h3>
                                        <p className="text-xs text-slate-500 mt-1">{selectedProduct.unit_of_measurement || 'Units'}</p>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100">
                                        <p className="text-[10px] text-muted italic leading-tight">Stock calculated from ledger transactions.</p>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="bg-white p-6 rounded-xl border border-primary/5 shadow-sm">
                                    <p className="text-slate-500 text-sm font-medium">Location</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                                            Shelf {selectedProduct.shelf_code}, Box {selectedProduct.box_code}
                                        </h3>
                                    </div>
                                    <button className="mt-4 text-[var(--color-cashcrow-primary)] text-xs font-semibold flex items-center gap-1 hover:underline">
                                        <MapPin className="w-3.5 h-3.5" />
                                        View on Floor Map
                                    </button>
                                </div>

                                {/* Min Stock Level */}
                                <div className="bg-white p-6 rounded-xl border border-primary/5 shadow-sm">
                                    <p className="text-slate-500 text-sm font-medium">Min. Stock Level</p>
                                    <div className="flex items-baseline gap-3 mt-2">
                                        <h3 className="text-3xl font-bold text-slate-900">{selectedProduct.min_stock_level || 0}</h3>
                                        <span className="text-slate-400 text-sm">Units</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                                        <div
                                            className="bg-[var(--color-cashcrow-primary)] h-full"
                                            style={{ width: `${Math.min(100, ((selectedProduct.quantity || 0) / (selectedProduct.min_stock_level || 1)) * 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="bg-white p-6 rounded-xl border border-primary/5 shadow-sm">
                                    <p className="text-slate-500 text-sm font-medium">Category</p>
                                    <div className="mt-2">
                                        <h3 className="text-xl font-bold text-slate-900">{selectedProduct.category}</h3>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-1">
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">Hardware</span>
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">Analog</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions & Supplier Info */}
                        <div className="px-8 pb-8">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                {/* Recent Daily Logs Table */}
                                <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-primary/5 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                                            <FileText className="w-4 h-4 text-[var(--color-cashcrow-primary)]" />
                                            Product Usage History
                                        </h4>
                                            <div className="flex items-center gap-2">
                                                <Link href="/admin/daily-log" className="text-xs font-bold text-[var(--color-cashcrow-primary)] hover:underline">View All →</Link>
                                                <button
                                                    onClick={() => setRefreshKey(prev => prev + 1)}
                                                    disabled={loadingLogs}
                                                    className="p-1.5 text-slate-400 hover:text-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-primary)]/5 rounded-lg transition-all disabled:opacity-50"
                                                    title="Refresh logs"
                                                >
                                                    {loadingLogs ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                        <RefreshCw className="w-3.5 h-3.5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="border-b border-slate-200">
                                                    <th className="text-left pb-2 font-semibold text-slate-600">Time</th>
                                                    <th className="text-left pb-2 font-semibold text-slate-600 pr-2">Part</th>
                                                    <th className="text-right pb-2 font-semibold text-slate-600">Qty</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loadingLogs ? (
                                                    Array.from({length: 3}).map((_, i) => (
                                                        <tr key={i} className="border-b border-slate-100">
                                                            <td className="py-2">
                                                                <div className="h-4 bg-slate-200 rounded animate-pulse w-12"></div>
                                                            </td>
                                                            <td className="py-2">
                                                                <div className="h-4 bg-slate-200 rounded animate-pulse w-24"></div>
                                                            </td>
                                                            <td className="py-2 text-right">
                                                                <div className="h-4 bg-slate-200 rounded animate-pulse w-8 mx-auto"></div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : recentLogs.length > 0 ? (
                                                    recentLogs.map((log, index) => (
                                                        <tr key={index} className={`border-b border-slate-100 hover:bg-slate-50 ${index === recentLogs.length - 1 ? '' : ''}`}>
                                                            <td className="py-2 text-slate-500">{log.time}</td>
                                                            <td className="py-2 truncate max-w-[120px]">{log.partName}</td>
                                                            <td className="py-2 text-right font-bold text-green-600">{log.sign}{log.quantity}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={3} className="py-8 text-center text-slate-500 text-sm">
                                                            {loadingLogs ? (
                                                                'Loading activity...'
                                                            ) : (
                                                                'No recent daily log history for this part'
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-2 text-center">Logs update in real-time</p>
                                </div>

                                {/* Supplier Info */}
                                <div className="bg-[var(--color-cashcrow-primary)]/5 p-6 rounded-xl border border-primary/10 shadow-sm">
                                    <h4 className="font-bold text-[var(--color-cashcrow-primary)] mb-3 flex items-center gap-2">
                                        <Truck className="w-5 h-5" />
                                        Supplier Info
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedProduct.vendors && selectedProduct.vendors.length > 0 ? (
                                            selectedProduct.vendors.map((vendor, index) => (
                                                <div key={index} className="space-y-1">
                                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                        Vendor {index + 1}
                                                    </p>
                                                    <p className="text-sm font-semibold text-slate-700">{vendor.name}</p>
                                                    {vendor.fund && (
                                                        <p className="text-xs text-slate-600">Fund: {vendor.fund}</p>
                                                    )}
                                                    {vendor.link && (
                                                        <a href={vendor.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[var(--color-cashcrow-primary)] hover:underline">
                                                            {vendor.link}
                                                        </a>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-500 italic">No supplier information</p>
                                        )}
                                        {selectedProduct.vendors && selectedProduct.vendors.length > 0 && (
                                            <button className="text-[var(--color-cashcrow-primary)] text-xs font-bold hover:underline w-full text-left">
                                                View All Suppliers →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Product Modal */}
                        {showEditModal && selectedProduct && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                {/* Backdrop */}
                                <div
                                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                                    onClick={() => setShowEditModal(false)}
                                />

                                {/* Modal Content */}
                                <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border">
                                    {/* Close Button */}
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        className="absolute top-4 right-4 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors z-10"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    <div className="p-8">
                                        <EditProductForm
                                            product={{...selectedProduct, image_url: selectedProduct?.image_url || undefined} as any}
                                            onSuccess={() => {
                                                setShowEditModal(false)
                                                setSelectedProduct(null)
                                                window.location.reload()
                                            }}
                                            onCancel={() => setShowEditModal(false)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notes Section */}
                        {selectedProduct.notes && (
                            <div className="px-8 pb-8">
                                <div className="bg-white p-6 rounded-xl border border-primary/5 shadow-sm">
                                    <h4 className="font-bold text-slate-900 mb-3">Notes</h4>
                                    <p className="text-sm text-slate-600">{selectedProduct.notes}</p>
                                </div>
                            </div>
                        )}

                        {/* Danger Zone */}
                        <div className="px-8 pb-8">
                            <div className="pt-8 border-t border-red-100">
                                <h4 className="text-red-600 font-bold flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-5 h-5" />
                                    Danger Zone
                                </h4>
                                <div className=" p-4 rounded-xl border border-red-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-red-900">Delete Part</p>
                                        <p className="text-xs text-red-700">This action cannot be undone. Product data will be permanently removed.</p>
                                    </div>
                                    {deleteError ? (
                                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-2">
                                            <p className="text-sm font-semibold text-red-800 flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4" />
                                                Delete Failed
                                            </p>
                                            <p className="text-sm text-red-700">{deleteError}</p>
                                            <div className="flex gap-2 pt-2">
                                                <button 
                                                    onClick={async (e) => {
                                                        e.stopPropagation()
                                                        if (selectedProduct) {
                                                            setDeleteError('')
                                                            setIsDeleting(true)
                                                            const result = await deleteProduct(selectedProduct.id)
                                                            if (result.success) {
                                                                router.refresh()
                                                                setSelectedProduct(null)
                                                            } else {
                                                                setDeleteError(result.error || 'Delete failed')
                                                            }
                                                            setIsDeleting(false)
                                                        }
                                                    }} 
                                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-md transition-colors flex items-center gap-1"
                                                >
                                                    {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Retry'}
                                                </button>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setDeleteError('')
                                                        setDeleteConfirmId(null)
                                                    }} 
                                                    className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-md hover:bg-slate-200 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : deleteConfirmId === selectedProduct?.id ? (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={async (e) => {
                                                    e.stopPropagation()
                                                    if (selectedProduct) {
                                                        setIsDeleting(true)
                                                        const result = await deleteProduct(selectedProduct.id)
                                                        if (result.success) {
                                                            router.refresh()
                                                            setSelectedProduct(null)
                                                        } else {
                                                            setDeleteError(result.error || 'Delete failed')
                                                        }
                                                        setIsDeleting(false)
                                                        setDeleteConfirmId(null)
                                                    }
                                                }} 
                                                disabled={isDeleting}
                                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2"
                                            >
                                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Delete'}
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setDeleteConfirmId(null)
                                                }} 
                                                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setDeleteConfirmId(selectedProduct?.id || null)
                                            }} 
                                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm hover:shadow-lg"
                                        >
                                            Delete Part
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

