import React from 'react'
import Link from 'next/link'
import { Package, PackageOpen, Tag } from 'lucide-react'
import type { SupplierProduct } from '@/actions/suppliers'

interface SupplierDetailProductsProps {
    products: SupplierProduct[]
}

function statusStyles(status: SupplierProduct['status']) {
    if (status === 'Out of Stock') return 'bg-red-100 text-red-700 ring-red-200'
    if (status === 'Low Stock') return 'bg-orange-100 text-orange-700 ring-orange-200'
    return 'bg-green-100 text-green-700 ring-green-200'
}

export default function SupplierDetailProducts({ products }: SupplierDetailProductsProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between gap-3 p-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[var(--color-cashcrow-primary)]/10 text-[var(--color-cashcrow-primary)]">
                        <Package className="w-5 h-5" />
                    </div>
                    <h2 className="font-bold text-slate-900">Products Supplied</h2>
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                    {products.length}
                </span>
            </div>

            {products.length === 0 ? (
                <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-inner mx-auto">
                        <PackageOpen className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">No products linked to this supplier</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {products.map(product => (
                        <Link
                            key={product.id}
                            href={`/admin/parts/${product.id}`}
                            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-[var(--color-cashcrow-primary)]/30 hover:shadow-md transition-all group"
                        >
                            <div className="w-11 h-11 rounded-lg border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                                {product.image_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <PackageOpen className="w-5 h-5 text-slate-400" />
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-[var(--color-cashcrow-primary)] transition-colors">
                                    {product.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-slate-500">
                                        <Tag className="w-3 h-3" />
                                        {product.sku}
                                    </span>
                                    {product.category && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold">
                                            {product.category}
                                        </span>
                                    )}
                                    <span className="text-[11px] font-semibold text-slate-500">Qty: <span className="text-slate-800 font-bold">{product.quantity}</span></span>
                                </div>
                            </div>

                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ring-1 shrink-0 ${statusStyles(product.status)}`}>
                                {product.status}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
