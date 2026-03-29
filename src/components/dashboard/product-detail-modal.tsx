'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    X, Edit3, Download, MapPin, FileText, Truck, AlertTriangle, ChevronRight, Loader2, RefreshCw
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Product } from '@/types/product'
import { deleteProduct } from '@/actions/products'
import { getProductRecentLogs } from '@/actions/day-logs'
import EditProductForm from '@/components/dashboard/edit-product-form'
import { getStockStatus } from './product-card'

interface ProductDetailModalProps {
    product: Product
    onClose: () => void
    onStatusChange?: () => void
}

export default function ProductDetailModal({ product, onClose, onStatusChange }: ProductDetailModalProps) {
    const router = useRouter()
    const [showEditModal, setShowEditModal] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
    const [deleteError, setDeleteError] = useState('')
    
    // Logs state
    const [recentLogs, setRecentLogs] = useState<any[]>([])
    const [loadingLogs, setLoadingLogs] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    const refreshLogs = async () => {
        if (!product) return
        setLoadingLogs(true)
        try {
            const result = await getProductRecentLogs(product.id)
            const logs = Array.isArray(result) ? result : result.logs || []
            setRecentLogs(logs)
        } catch (error) {
            console.error('Error fetching logs:', error)
            setRecentLogs([])
        } finally {
            setLoadingLogs(false)
        }
    }

    useEffect(() => {
        refreshLogs()
    }, [product.id, refreshKey])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--color-cashcrow-bg-light)] rounded-2xl shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-600 transition-colors z-10 border border-slate-200"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Breadcrumbs & Title */}
                <div className="p-8 pb-4">
                    <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                        <span onClick={onClose} className="hover:text-[var(--color-cashcrow-primary)] transition-colors cursor-pointer">Parts</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-[var(--color-cashcrow-primary)] font-medium">{product.name}</span>
                    </nav>
                    <h2 className="text-3xl text-slate-900 tracking-tight font-bold">{product.name}</h2>
                    <p className="text-slate-500 font-mono text-sm mt-1">SKU: {product.sku}</p>

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
                                    console.log('PDF download for', product)
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
                                    const status = getStockStatus(product.quantity || 0, product.min_stock_level || 0)
                                    return (
                                        <span className={`px-2 py-0.5 ${status.bg} ${status.text} text-[10px] font-bold rounded uppercase tracking-wider ring-1 ${status.ring}`}>
                                            {status.label}
                                        </span>
                                    )
                                })()}
                            </div>
                            <div className="mt-2">
                                <h3 className="text-4xl font-extrabold text-slate-900">{product.quantity || 0}</h3>
                                <p className="text-xs text-slate-500 mt-1">{product.unit_of_measurement || 'Units'}</p>
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
                                    Shelf {product.shelf_code}, Box {product.box_code}
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
                                <h3 className="text-3xl font-bold text-slate-900">{product.min_stock_level || 0}</h3>
                                <span className="text-slate-400 text-sm">Units</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                                <div
                                    className="bg-[var(--color-cashcrow-primary)] h-full"
                                    style={{ width: `${Math.min(100, ((product.quantity || 0) / (product.min_stock_level || 1)) * 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="bg-white p-6 rounded-xl border border-primary/5 shadow-sm">
                            <p className="text-slate-500 text-sm font-medium">Category</p>
                            <div className="mt-2">
                                <h3 className="text-xl font-bold text-slate-900">{product.category}</h3>
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
                                    <div className="flex items-center gap-2 ml-4">
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
                            <div className="space-y-3">
                                {loadingLogs ? (
                                    Array.from({length: 3}).map((_, i) => (
                                        <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 animate-pulse">
                                            <div className="flex items-center justify-between">
                                                <div className="h-4 bg-slate-200 rounded w-24"></div>
                                                <div className="h-6 bg-slate-200 rounded w-12"></div>
                                            </div>
                                            <div className="h-3 bg-slate-200 rounded w-32 mt-2"></div>
                                        </div>
                                    ))
                                ) : recentLogs.length > 0 ? (
                                    recentLogs.map((log, index) => (
                                        <div key={index} className="p-4 bg-white rounded-xl border border-slate-200 hover:shadow-sm hover:bg-slate-50 transition-all">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-500 font-medium">{log.time}</span>
                                                <span className="font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs">
                                                    {log.sign}{log.quantity}
                                                </span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900 mt-2 truncate">{log.partName}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                        <p className="text-sm text-slate-500 font-medium">No recent activity</p>
                                    </div>
                                )}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 text-center">Logs update in real-time</p>
                        </div>

                        {/* Supplier Info */}
                        <div className="bg-[var(--color-cashcrow-primary)]/5 p-6 rounded-xl border border-primary/10 shadow-sm">
                            <h4 className="font-bold text-[var(--color-cashcrow-primary)] mb-3 flex items-center gap-2">
                                <Truck className="w-5 h-5" />
                                Supplier Info
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                                {product.vendors && product.vendors.length > 0 ? (
                                    product.vendors.slice(0, 4).map((vendor, index) => (
                                        <div key={index} className="group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer p-3">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="w-10 h-10 rounded-lg bg-[var(--color-cashcrow-primary)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-cashcrow-primary)]/20">
                                                    <span className="text-sm font-bold text-[var(--color-cashcrow-primary)]">
                                                        {vendor.fund ? (vendor.name || '').slice(0,2).toUpperCase() : '??'}
                                                    </span>
                                                </div>
                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                                                    ₹{vendor.fund || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-bold text-slate-900 text-sm mb-2 truncate group-hover:text-[var(--color-cashcrow-primary)]">
                                                    {vendor.name || 'Unnamed Vendor'}
                                                </h4>
                                                {vendor.link && (
                                                    <a 
                                                        href={vendor.link} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="text-xs font-medium text-slate-600 hover:text-[var(--color-cashcrow-primary)] hover:underline block truncate"
                                                    >
                                                        {vendor.link}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full p-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                        <Truck className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                        <h4 className="text-lg font-bold text-slate-800 mb-2">No Suppliers</h4>
                                        <p className="text-slate-500 text-sm">Add suppliers via Edit Product</p>
                                    </div>
                                )}
                            </div>
                            {product.vendors && product.vendors.length > 4 && (
                                <div className="col-span-full mt-4 pt-4 border-t border-slate-200">
                                    <Link href={`/admin/suppliers?product=${product.id}&name=${encodeURIComponent(product.name)}`} className="text-[var(--color-cashcrow-primary)] text-xs font-bold hover:underline w-full text-left block">
                                        View all {product.vendors.length} suppliers →
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Edit Product Modal */}
                {showEditModal && (
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
                                    product={{...product, image_url: product?.image_url || undefined} as any}
                                    onSuccess={() => {
                                        setShowEditModal(false)
                                        if (onStatusChange) onStatusChange()
                                        router.refresh()
                                    }}
                                    onCancel={() => setShowEditModal(false)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Notes Section */}
                {product.notes && (
                    <div className="px-8 pb-8">
                        <div className="bg-white p-6 rounded-xl border border-primary/5 shadow-sm">
                            <h4 className="font-bold text-slate-900 mb-3">Notes</h4>
                            <p className="text-sm text-slate-600">{product.notes}</p>
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
                                                setDeleteError('')
                                                setIsDeleting(true)
                                                const result = await deleteProduct(product.id)
                                                if (result.success) {
                                                    router.refresh()
                                                    if (onStatusChange) onStatusChange()
                                                    onClose()
                                                } else {
                                                    setDeleteError(result.error || 'Delete failed')
                                                }
                                                setIsDeleting(false)
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
                            ) : deleteConfirmId === product.id ? (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={async (e) => {
                                            e.stopPropagation()
                                            setIsDeleting(true)
                                            const result = await deleteProduct(product.id)
                                            if (result.success) {
                                                router.refresh()
                                                if (onStatusChange) onStatusChange()
                                                onClose()
                                            } else {
                                                setDeleteError(result.error || 'Delete failed')
                                            }
                                            setIsDeleting(false)
                                            setDeleteConfirmId(null)
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
                                        setDeleteConfirmId(product.id)
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
    )
}
