'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
    Search,
    PlusCircle,
    PackageOpen,
    ArrowLeft,
    ArrowRight
} from 'lucide-react'
import { Product } from '@/types/product'
import ProductCard from '@/components/shared/inventory/product-card'
import ProductDetailModal from '@/components/shared/inventory/product-detail-modal'

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

    return (
        <div className="space-y-8 h-full flex flex-col">
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
                    filteredProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onClick={() => setSelectedProduct(product)}
                            onDownloadPdf={() => console.log('PDF download for', product)}
                        />
                    ))
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
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onStatusChange={() => setSelectedProduct(null)}
                />
            )}
        </div>
    )
}
