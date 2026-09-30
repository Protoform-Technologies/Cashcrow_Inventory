'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Plus } from 'lucide-react'
import { buttonStyles } from '@/components/ui/button'
import { getInventory } from '@/actions/dashboard'

interface InventoryItem {
    id: string
    name: string
    category: string
    sku: string
    qty: string
    status: string
}

interface InventoryTableProps {
    items: InventoryItem[]
    totalCount: number
    currentPage: number
    basePath?: string
    isDashboard?: boolean
    /** When set, the empty state shows an "Add Products" button. Admin-only. */
    addPath?: string
}

export default function InventoryTable({
    items: initialItems,
    totalCount,
    currentPage,
    basePath = '/admin/parts',
    isDashboard = false,
    addPath,
}: InventoryTableProps) {
    const router = useRouter()
    const limit = 5

    // Pagination is handled client-side: clicking Next/Previous fetches ONLY the
    // next inventory page via a server action, instead of navigating the whole
    // route (which would needlessly re-run every other dashboard query).
    const [items, setItems] = useState<InventoryItem[]>(initialItems)
    const [page, setPage] = useState(currentPage)
    const [isPending, startTransition] = useTransition()
    const totalPages = Math.ceil(totalCount / limit)

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages || isPending) return
        startTransition(async () => {
            const { products } = await getInventory(newPage, limit)
            setItems(products as InventoryItem[])
            setPage(newPage)
        })
    }

    // Click a row/card → open that product's detail page.
    const openPart = (id: string) => router.push(`${basePath}/${id}`)

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">Stock Inventory</h3>
                <button className="text-[var(--color-cashcrow-primary)] text-sm font-bold hover:underline underline-offset-4 transition-all" onClick={() => router.push(basePath)}>
                    View All Inventory
                </button>
            </div>

            {items.length === 0 ? (
                /* Empty state */
                <div className="bg-white p-10 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                        <Package className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="font-black text-slate-900">No products yet</p>
                        <p className="text-sm text-slate-500 mt-1">Add your first product to start tracking inventory.</p>
                    </div>
                    {addPath && (
                        <Link href={addPath} className={buttonStyles({ variant: 'primary', size: 'md' })}>
                            <Plus className="w-5 h-5" />
                            Add Products
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    {/* Mobile Card View */}
                    <div className={`grid grid-cols-1 gap-3 lg:hidden transition-opacity ${isPending ? 'opacity-50' : ''}`}>
                        {items.slice(0, 5).map((item, i) => (
                            <div
                                key={i}
                                onClick={() => openPart(item.id)}
                                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 cursor-pointer hover:border-[var(--color-cashcrow-primary)]/30 hover:shadow-md transition-all active:scale-[0.99]"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-slate-900 leading-tight">{item.name}</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">{item.category}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider shrink-0 ${item.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' :
                                        item.status === 'Low Stock' ? 'bg-orange-100 text-orange-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                    <code className="text-[10px] bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-md font-mono">
                                        {item.sku}
                                    </code>
                                    <div className="text-right">
                                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Quantity</p>
                                        <p className={`font-black text-sm ${item.status === 'Low Stock' ? 'text-orange-600' :
                                            item.status === 'Out of Stock' ? 'text-red-600' :
                                                'text-slate-900'
                                            }`}>{item.qty}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className={`hidden lg:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-opacity ${isPending ? 'opacity-50' : ''}`}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-500 text-[13px] uppercase tracking-[0.15em] font-black border-b border-slate-100">
                                        <th className="px-6 py-4">Item Name</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">SKU</th>
                                        <th className="px-6 py-4 text-right">Qty</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {items.slice(0, 5).map((item, i) => (
                                        <tr
                                            key={i}
                                            onClick={() => openPart(item.id)}
                                            className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-800 group-hover:text-[var(--color-cashcrow-primary)] transition-colors text-sm">{item.name}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-[12px] text-slate-500 font-bold bg-slate-100/80 px-3 py-1 rounded-lg uppercase tracking-wide">{item.category}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <code className="text-[13px] text-slate-400 font-mono">
                                                    {item.sku}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <span className={`font-black text-xs ${item.status === 'Low Stock' ? 'text-orange-600' :
                                                    item.status === 'Out of Stock' ? 'text-red-600' :
                                                        'text-slate-900'
                                                    }`}>{item.qty}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <span className={`px-3 py-1.5 text-[10px] font-black rounded-full uppercase tracking-wider inline-block ${item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                    item.status === 'Low Stock' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                                        'bg-red-50 text-red-600 border border-red-100'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-2">
                            <p className="text-[12px] text-slate-500 font-bold lowercase tracking-wide">
                                Showing <span className="text-[var(--color-cashcrow-primary)] font-black">{(page - 1) * limit + 1}</span> to <span className="text-[var(--color-cashcrow-primary)] font-black">{Math.min(page * limit, totalCount)}</span> of <span className="font-black">{totalCount}</span> items
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1 || isPending}
                                    className={buttonStyles({ variant: 'outline', size: 'sm' })}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages || isPending}
                                    className={buttonStyles({ variant: 'primary', size: 'sm' })}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
