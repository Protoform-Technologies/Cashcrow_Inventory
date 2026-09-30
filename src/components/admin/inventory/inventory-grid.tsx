'use client'

import { useState, useEffect, useTransition, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PlusCircle, PackageOpen, Search, X, PackageCheck, Truck, Boxes } from 'lucide-react'
import { toast } from 'sonner'
import { Product } from '@/types/product'
import ProductCard from '@/components/shared/inventory/product-card'
import { buttonStyles } from '@/components/ui/button'
import FilterSelect from '@/components/ui/filter-select'
import { getProducts } from '@/actions/products'

const LIMIT = 6

interface InventoryGridProps {
    products: Product[]
    totalCount: number
    currentPage: number
    totalPages: number
    query?: string
    statusFilter?: string
    basePath?: string
}

export default function InventoryGrid({
    products: initialProducts,
    totalCount: initialTotalCount,
    currentPage: initialPage,
    query,
    statusFilter = 'active',
    basePath = '/admin/parts'
}: InventoryGridProps) {
    const pathname = usePathname()

    // Everything is driven by client state now. Filter/search/pagination fetch
    // ONLY the products via a server action and swap them in — no full-page
    // navigation, no middleware re-auth, no re-render of the rest of the page.
    const [products, setProducts] = useState<Product[]>(initialProducts)
    const [totalCount, setTotalCount] = useState(initialTotalCount)
    const [page, setPage] = useState(initialPage)
    const [status, setStatus] = useState(statusFilter || 'active')
    const [activeQuery, setActiveQuery] = useState(query || '')
    const [inputValue, setInputValue] = useState(query || '')
    const [isPending, startTransition] = useTransition()

    const totalPages = Math.max(1, Math.ceil(totalCount / LIMIT))

    const runFetch = useCallback((nextPage: number, nextStatus: string, nextQuery: string) => {
        startTransition(async () => {
            const { products: rows, count } = await getProducts(nextPage, LIMIT, nextQuery, nextStatus)
            setProducts(rows as Product[])
            setTotalCount(count)
            setPage(nextPage)
            setStatus(nextStatus)
            setActiveQuery(nextQuery)

            // Keep the URL shareable/refreshable WITHOUT triggering a navigation.
            const params = new URLSearchParams()
            if (nextStatus && nextStatus !== 'active') params.set('status', nextStatus)
            if (nextQuery) params.set('q', nextQuery)
            if (nextPage > 1) params.set('page', String(nextPage))
            const qs = params.toString()
            window.history.replaceState(null, '', qs ? `${pathname}?${qs}` : pathname)
        })
    }, [pathname])

    // Debounced live search (fires at 0 or 2+ chars, matching the previous rule).
    useEffect(() => {
        if (inputValue === activeQuery) return
        const timeoutId = setTimeout(() => {
            if (inputValue.length >= 2 || inputValue.length === 0) {
                runFetch(1, status, inputValue)
            }
        }, 300)
        return () => clearTimeout(timeoutId)
    }, [inputValue, activeQuery, status, runFetch])

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        runFetch(1, status, inputValue)
    }

    const clearSearch = () => {
        setInputValue('')
        runFetch(1, status, '')
    }

    return (
        <div className="space-y-4 md:space-y-6 h-full flex flex-col animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Parts Inventory</h2>
                    <p className="text-slate-500 font-medium mt-1">Manage and track your laboratory parts</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <div className="order-2 sm:order-1 w-full sm:w-64">
                        <FilterSelect
                            value={status}
                            onChange={(val) => runFetch(1, val, activeQuery)}
                            options={[
                                { id: 'active', label: 'Active (Arrived)', icon: PackageCheck },
                                { id: 'inactive', label: 'Shipping (Not Active)', icon: Truck },
                                { id: 'all', label: 'All Parts', icon: Boxes },
                            ]}
                        />
                    </div>
                    <form onSubmit={handleSearchSubmit} className="order-1 sm:order-2 relative w-full sm:w-64 group/search">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/search:text-[var(--color-cashcrow-primary)] transition-colors" />
                        <input
                            type="text"
                            name="q"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Search parts..."
                            className="w-full h-12 pl-10 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] bg-slate-50/50 focus:bg-white transition-all"
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
                    <Link href="/admin/add-parts" className={buttonStyles({ variant: 'primary', size: 'md', className: 'order-3 w-full sm:w-auto shrink-0' })}>
                        <PlusCircle className="w-5 h-5" />
                        Add Part
                    </Link>
                </div>
            </div>

            {/* Product Cards Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity ${isPending ? 'opacity-50' : ''}`}>
                {products.length === 0 ? (
                    <div className="col-span-full">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-inner mx-auto">
                                {!activeQuery && status === 'inactive'
                                    ? <Truck className="w-8 h-8 text-slate-400" />
                                    : <PackageOpen className="w-8 h-8 text-slate-400" />}
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">
                                {activeQuery
                                    ? 'No matches'
                                    : status === 'inactive'
                                        ? 'Nothing in transit'
                                        : status === 'active'
                                            ? 'No active parts'
                                            : 'No parts found'}
                            </h3>
                            <p className="text-slate-500 max-w-sm mb-6 mx-auto">
                                {activeQuery
                                    ? `No parts match "${activeQuery}".`
                                    : status === 'inactive'
                                        ? 'All parts have arrived - nothing is being shipped at the moment.'
                                        : status === 'active'
                                            ? 'There are no active parts in your inventory right now.'
                                            : "You haven't added any parts to the inventory yet."}
                            </p>
                            {/* Only offer "Add" when it makes sense — not for a shipping/empty-filter result. */}
                            {!activeQuery && status !== 'inactive' && (
                                <Link href="/admin/add-parts" className={buttonStyles({ variant: 'primary', size: 'md' })}>
                                    <PlusCircle className="w-5 h-5" />
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

            {/* Pagination — same style as the Home dashboard (Showing … + Previous/Next) */}
            {products.length > 0 && (
                <div className="mt-auto flex items-center justify-between pt-4">
                    <p className="text-[12px] text-slate-500 font-bold lowercase tracking-wide">
                        Showing <span className="text-[var(--color-cashcrow-primary)] font-black">{(page - 1) * LIMIT + 1}</span> to <span className="text-[var(--color-cashcrow-primary)] font-black">{Math.min(page * LIMIT, totalCount)}</span> of <span className="font-black">{totalCount}</span> results
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => runFetch(page - 1, status, activeQuery)}
                            disabled={page === 1 || isPending}
                            className={buttonStyles({ variant: 'outline', size: 'sm' })}
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => runFetch(page + 1, status, activeQuery)}
                            disabled={page >= totalPages || isPending}
                            className={buttonStyles({ variant: 'primary', size: 'sm' })}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
