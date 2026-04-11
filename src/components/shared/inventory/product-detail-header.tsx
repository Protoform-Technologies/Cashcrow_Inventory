import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import ProductDetailActions from '@/components/admin/inventory/product-detail-actions'
import { Product } from '@/types/product'

interface ProductDetailHeaderProps {
    product: Product
    basePath: string
    logs: any[]
    userName: string
    isAdmin?: boolean
}

export default function ProductDetailHeader({
    product,
    basePath,
    logs,
    userName,
    isAdmin = false
}: ProductDetailHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
                <Link
                    href={basePath}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[var(--color-cashcrow-primary)] transition-colors group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Inventory
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">{product.name}</h1>
                    <p className="text-slate-600 text-12xl font-mono text-[10px] mt-1 uppercase tracking-widest">SKU: {product.sku}</p>
                </div>
            </div>

            <ProductDetailActions
                product={product}
                logs={logs}
                userName={userName}
                isAdmin={isAdmin}
            />
        </div>
    )
}
