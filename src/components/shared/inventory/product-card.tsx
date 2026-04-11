'use client'

import { PackageOpen, MapPin, Tag, Download, ChevronRight } from 'lucide-react'
import { Product } from '@/types/product' // I need to create this or extract the interface

interface StockStatus {
    label: string
    color: string
    bg: string
    text: string
    ring: string
}

export function getStockStatus(quantity: number, minLevel: number): StockStatus {
    if (quantity === 0) return { label: 'Out of Stock', color: 'red', bg: 'bg-red-100', text: 'text-red-700', ring: 'ring-red-200' }
    if (quantity <= minLevel) return { label: 'Low Stock', color: 'orange', bg: 'bg-orange-100', text: 'text-orange-700', ring: 'ring-orange-200' }
    return { label: 'In Stock', color: 'green', bg: 'bg-green-100', text: 'text-green-700', ring: 'ring-green-200' }
}

interface ProductCardProps {
    product: Product
    onClick?: () => void
    onDownloadPdf?: (e: React.MouseEvent) => void
}

export default function ProductCard({ product, onClick, onDownloadPdf }: ProductCardProps) {
    const stockStatus = getStockStatus(product.quantity || 0, product.min_stock_level || 0)
    const stockPercentage = product.min_stock_level > 0
        ? Math.min(100, ((product.quantity || 0) / product.min_stock_level) * 100)
        : 100

    return (
        <div
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer flex flex-col h-full"
            onClick={onClick}
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
            <div className="p-5 space-y-4 flex-1">
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
                <div className="space-y-2 mt-auto pt-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">Stock Level</span>
                        <span className="text-xs font-bold text-slate-700">
                            {product.quantity} / {product.min_stock_level}
                        </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${
                                stockStatus.color === 'green' ? 'bg-emerald-500' : 
                                stockStatus.color === 'orange' ? 'bg-orange-500' : 
                                'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, stockPercentage)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Card Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between mt-auto">
                <button
                    className={`text-xs font-bold flex items-center gap-1 transition-colors ${
                        product.data_sheet_url 
                            ? 'text-[var(--color-cashcrow-primary)] hover:underline' 
                            : 'text-slate-300 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                        e.stopPropagation()
                        if (onDownloadPdf) onDownloadPdf(e)
                    }}
                    title={product.data_sheet_url ? 'Download technical data sheet' : 'No data sheet available'}
                >
                    <Download className={`w-3.5 h-3.5 ${product.data_sheet_url ? '' : 'text-slate-300'}`} />
                    {product.data_sheet_url ? 'Data Sheet' : 'No data sheet'}
                </button>
                <span className="text-xs text-slate-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Details
                    <ChevronRight className="w-3.5 h-3.5" />
                </span>
            </div>
        </div>
    )
}
