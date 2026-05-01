'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { PlusCircle, PackageOpen, ArrowLeft, ArrowRight, Search, X } from 'lucide-react'
import { toast } from 'sonner'
import { Product } from '@/types/product'
import ProductCard from '@/components/shared/inventory/product-card'

interface InventoryGridProps {
    products: Product[]
    totalCount: number
    currentPage: number
    totalPages: number
    query?: string
    basePath?: string
}

export default function InventoryGrid({
    products,
    totalCount,
    currentPage,
    totalPages,
    query,
    basePath = '/admin/parts'
}: InventoryGridProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [inputValue, setInputValue] = useState(query || '')

    // Synchronize local input with prop changes (e.g., when clearing from another source or URL update)
    useEffect(() => {
        setInputValue(query || '')
    }, [query])

    // Live search effect with debounce
    useEffect(() => {
        // Only trigger search if value is 0 characters or 2+ characters
        if (inputValue !== query) {
            const timeoutId = setTimeout(() => {
                const params = new URLSearchParams(searchParams.toString())
                if (inputValue.length >= 2) {
                    params.set('q', inputValue)
                    params.set('page', '1')
                } else if (inputValue.length === 0) {
                    params.delete('q')
                    params.set('page', '1')
                } else {
                    // Do nothing for 1 character as per requirement
                    return
                }
                router.push(`${pathname}?${params.toString()}`)
            }, 300)

            return () => clearTimeout(timeoutId)
        }
    }, [inputValue, query, pathname, router, searchParams])

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const params = new URLSearchParams(searchParams.toString())
        if (inputValue) {
            params.set('q', inputValue)
        } else {
            params.delete('q')
        }
        params.set('page', '1')
        router.push(`${pathname}?${params.toString()}`)
    }

    const clearSearch = () => {
        setInputValue('')
        const params = new URLSearchParams(searchParams.toString())
        params.delete('q')
        params.set('page', '1')
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="space-y-8 h-full flex flex-col animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Parts Inventory</h2>
                    <p className="text-slate-500 font-medium mt-1">Manage and track your laboratory parts</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64 group/search">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/search:text-[var(--color-cashcrow-primary)] transition-colors" />
                        <input
                            type="text"
                            name="q"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Search parts..."
                            className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] bg-slate-50/50 focus:bg-white transition-all"
                        />
                        {inputValue && (
                            <button 
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </form>
                    <Link href="/admin/add-parts" className="shrink-0 flex items-center gap-2 bg-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-lightgreen)] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-colors">
                        <PlusCircle className="w-4 h-4" />
                        Add Part
                    </Link>
                </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length === 0 ? (
                    <div className="col-span-full">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-inner mx-auto">
                                <PackageOpen className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">No parts found</h3>
                            <p className="text-slate-500 max-w-sm mb-6 mx-auto">
                                {query ? `No parts match "${query}".` : "You haven't added any parts to the inventory yet."}
                            </p>
                            {!query && (
                                <Link href="/admin/add-parts" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors">
                                    <PlusCircle className="w-4 h-4" />
                                    Add First Part
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    products.map(product => (
                        <div key={product.id} className="cursor-pointer group">
                             {/* Linking directly to detail page now */}
                             <Link href={`${basePath}/${product.id}`}>
                                <ProductCard
                                    product={product}
                                    onDownloadPdf={(e: React.MouseEvent) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        if (product.data_sheet_url) {
                                            window.open(product.data_sheet_url, '_blank')
                                        } else {
                                            toast.error('No technical data sheet available for this part.')
                                        }
                                    }}
                                />
                             </Link>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {products.length > 0 && (
                <div className="mt-auto p-4 border-t border-slate-200 flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Showing <span className="font-bold text-slate-800">{(currentPage - 1) * 6 + 1}</span> to <span className="font-bold text-slate-800">{Math.min(currentPage * 6, totalCount)}</span> of <span className="font-bold text-slate-800">{totalCount}</span> results
                    </p>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`${basePath}?page=${Math.max(1, currentPage - 1)}${query ? `&q=${query}` : ''}`}
                            className={`p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-600 transition-colors ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div className="hidden sm:flex items-center gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <Link
                                    key={i}
                                    href={`${basePath}?page=${i + 1}${query ? `&q=${query}` : ''}`}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${currentPage === i + 1 ? 'bg-[var(--color-cashcrow-primary)] text-white' : 'hover:bg-slate-200 text-slate-600'}`}
                                >
                                    {i + 1}
                                </Link>
                            ))}
                        </div>
                        <Link
                            href={`${basePath}?page=${Math.min(totalPages, currentPage + 1)}${query ? `&q=${query}` : ''}`}
                            className={`p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-600 transition-colors ${currentPage >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
