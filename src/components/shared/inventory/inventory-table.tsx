'use client'

import { useRouter, useSearchParams } from 'next/navigation'

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
}

export default function InventoryTable({ items, totalCount, currentPage }: InventoryTableProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const limit = 5
    const totalPages = Math.ceil(totalCount / limit)

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', newPage.toString())
        router.push(`/admin?${params.toString()}`)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">Stock Inventory</h3>
                <button className="text-[var(--color-cashcrow-primary)] text-sm font-bold hover:underline underline-offset-4 transition-all" onClick={() => router.push('/admin/parts')}>
                    View All Inventory
                </button>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-3 lg:hidden">
                {items.length > 0 ? items.slice(0, 5).map((item, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
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
                )) : (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-500 font-medium">
                        No inventory items found.
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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
                            {items.length > 0 ? items.slice(0, 5).map((item, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-6.5">
                                        <p className="font-bold text-slate-800 group-hover:text-[var(--color-cashcrow-primary)] transition-colors text-sm">{item.name}</p>
                                    </td>
                                    <td className="px-6 py-6.5">
                                        <span className="text-[12px] text-slate-500 font-bold bg-slate-100/80 px-3 py-1 rounded-lg uppercase tracking-wide">{item.category}</span>
                                    </td>
                                    <td className="px-6 py-6.5">
                                        <code className="text-[13px] text-slate-400 font-mono">
                                            {item.sku}
                                        </code>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <span className={`font-black text-xs ${item.status === 'Low Stock' ? 'text-orange-600' :
                                            item.status === 'Out of Stock' ? 'text-red-600' :
                                                'text-slate-900'
                                            }`}>{item.qty}</span>
                                    </td>
                                    <td className="px-6 py-6.5 text-center">
                                        <span className={`px-3 py-1.5 text-[10px] font-black rounded-full uppercase tracking-wider ${item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                            item.status === 'Low Stock' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                                'bg-red-50 text-red-600 border border-red-100'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                                        No inventory items found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <p className="text-[12px] text-slate-500 font-bold lowercase tracking-wide text-center sm:text-left">
                        Showing <span className="text-[var(--color-cashcrow-primary)] font-black">{(currentPage - 1) * limit + 1}</span> to <span className="text-[var(--color-cashcrow-primary)] font-black">{Math.min(currentPage * limit, totalCount)}</span> of <span className="font-black">{totalCount}</span> items
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-[11px] font-black bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-[11px] font-black bg-[var(--color-cashcrow-primary)] text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 shadow-[var(--color-cashcrow-primary)]/10"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
